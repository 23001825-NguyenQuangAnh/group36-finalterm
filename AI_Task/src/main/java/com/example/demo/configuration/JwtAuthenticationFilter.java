package com.example.demo.configuration;

import com.example.demo.repository.InvalidatedTokenRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor   // Tự động tạo constructor chứa các dependency final
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    // Filter dùng để kiểm tra JWT cho mỗi request (chạy đúng 1 lần / request)

    private final JwtService jwtService;
    private final UserRepository userRepository;
    private final InvalidatedTokenRepository invalidatedTokenRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        // Lấy giá trị header Authorization từ request
        String authHeader = request.getHeader("Authorization");

        // Nếu không có Authorization hoặc không bắt đầu bằng "Bearer " thì bỏ qua filter
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response); // chuyển tiếp request
            return;
        }

        // Tách token từ header Authorization
        String token = authHeader.substring(7);

        // Giải mã token để lấy email (claim) bên trong JWT
        String email = jwtService.extractEmail(token);

        // Chỉ xử lý nếu email tồn tại và chưa có authentication trong SecurityContext
        if(email != null && SecurityContextHolder.getContext().getAuthentication() == null) {

            // Lấy thông tin User từ database
            UserDetails user = userRepository.findByEmail(email).orElse(null);

            // Validate token:
            // 1. Token hợp lệ về chữ ký / thời hạn
            // 2. User tồn tại
            // 3. Token không nằm trong danh sách token đã bị vô hiệu (đã logout)
            if (jwtService.validateToken(token) && user != null && !invalidatedTokenRepository.existsByToken(token)) {

                // Tạo đối tượng Authentication đưa vào SecurityContext
                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(
                                user,               // principal
                                null,               // credentials (null vì không cần mật khẩu nữa)
                                null                // authorities (tạm set null nếu không dùng Role)
                        );

                // Gắn thêm thông tin request (IP, trình duyệt)
                authentication.setDetails(
                        new WebAuthenticationDetailsSource().buildDetails(request)
                );

                // Set Authentication vào SecurityContext → xem như user đã đăng nhập
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        }

        filterChain.doFilter(request, response);
    }
}
