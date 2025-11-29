package com.example.demo.configuration;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

@Configuration                      // Đánh dấu đây là class cấu hình Spring
@RequiredArgsConstructor            // Tự động tạo constructor cho các final fields
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    // Filter để kiểm tra JWT cho mỗi request

    private final String[] PUBLIC_ENDPOINTS = {
            "/auth/login", "/auth/register", "/auth/refresh"
            // Các API không cần xác thực → cho phép truy cập công khai
    };

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                // Tắt CSRF vì API dùng JWT (stateless), không dùng cookie/session
                .csrf(AbstractHttpConfigurer::disable)

                // Bật CORS để frontend gọi API (cấu hình chi tiết nằm ở bean corsFilter phía dưới)
                .cors(corf -> {})

                // Quy định quyền truy cập
                .authorizeHttpRequests(auth -> auth
                                .requestMatchers(PUBLIC_ENDPOINTS).permitAll()
                                // Các endpoint auth/login, register, refresh không cần token

                                .anyRequest().authenticated()
                        // Tất cả các request còn lại bắt buộc phải có JWT hợp lệ
                )

                // Cấu hình session ở chế độ stateless → không lưu session, chỉ dùng JWT
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )

                // Thêm JWT filter vào trước filter đăng nhập mặc định của Spring Security
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)

                // Xây dựng SecurityFilterChain hoàn chỉnh
                .build();
    }

    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration corsConfiguration = new CorsConfiguration();

        // Cho phép frontend React chạy trên port 5173 gọi API
        corsConfiguration.addAllowedOrigin("http://localhost:5173");

        // Cho phép tất cả phương thức: GET, POST, PUT, DELETE...
        corsConfiguration.addAllowedMethod("*");

        // Cho phép tất cả headers: Authorization, Content-Type...
        corsConfiguration.addAllowedHeader("*");

        // Cho phép gửi cookie hoặc Authorization header
        corsConfiguration.setAllowCredentials(true);

        // Áp dụng CORS cho tất cả các đường dẫn
        UrlBasedCorsConfigurationSource urlBasedCorsConfigurationSource = new UrlBasedCorsConfigurationSource();
        urlBasedCorsConfigurationSource.registerCorsConfiguration("/**", corsConfiguration);

        return new CorsFilter(urlBasedCorsConfigurationSource);
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        // AuthenticationManager dùng để xác thực username/password khi login
        return config.getAuthenticationManager();
    }

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        // Dùng BCrypt để mã hoá mật khẩu khi lưu vào database
        return new BCryptPasswordEncoder();
    }

    @Bean
    public RestTemplate restTemplate() {
        // RestTemplate dùng để gọi API từ server nếu cần
        return new RestTemplate();
    }
}
