// src/components/TaskCard.jsx
import React from 'react';
import { CATEGORIES } from '../constants.js'; 

function TaskCard({ task, onMove, onComplete, onRestore }) {
  const category = CATEGORIES.find(c => c.id === task.categoryId);

  return (
    <div className="bg-white p-3 rounded shadow-sm">
      {/* CẬP NHẬT: Không thay đổi dòng này */}
      <div className="flex justify-between items-start gap-2">
        
        {/* CẬP NHẬT: Thêm 'flex-1' và 'min-w-0'
          - 'flex-1': Cho phép div này dãn ra để chiếm hết không gian trống.
          - 'min-w-0': Cho phép div này co lại nhỏ hơn nội dung của nó,
                      đây là chìa khóa để 'truncate' và 'line-clamp' hoạt động.
        */}
        <div className="flex-1 min-w-0"> 
          
          {category && (
            <span className="text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full mb-1 inline-block">
              {category.name}
            </span>
          )}
          
          {/* Class 'truncate' và 'title' đã có sẵn từ code trước.
            'truncate' sẽ ẩn chữ thừa và thêm dấu '...'
            'title={task.title}' sẽ hiện đầy đủ khi di chuột vào.
          */}
          <div 
            className="font-medium truncate" 
            title={task.title}
          >
            {task.title}
          </div>
          
          {task.description && (
            /* 'line-clamp-2' ẩn chữ thừa sau 2 dòng.
              'title={task.description}' sẽ hiện đầy đủ khi di chuột vào.
            */
            <p 
              className="text-sm text-gray-600 mt-1 line-clamp-2"
              title={task.description}
            >
              {task.description}
            </p>
          )}

          {/* Các thông tin phụ (duration, deadline, importance) */}
          <div className="text-xs text-gray-500 mt-1">{task.durationMins} mins</div>
          {task.deadline && (
            <div className="text-xs text-red-600 mt-1">
              Deadline: {new Date(task.deadline + 'T00:00:00').toLocaleDateString()}
            </div>
          )}
          {task.importance && (
             <div className="text-xs text-purple-600 mt-1">
              Quan trọng: <strong>{task.importance}/10</strong>
            </div>
          )}
        </div>

        {/* CẬP NHẬT: Thêm 'flex-shrink-0'
          - 'flex-shrink-0': Ngăn không cho cột buttons này bị co lại
                           khi text ở cột bên trái quá dài.
        */}
        <div className="flex flex-col gap-2 flex-shrink-0">
          
          {/* Logic các nút (giữ nguyên) */}
          {task.status !== "completed" && (
            <>
              {task.status === "priority" ? (
                <button 
                  onClick={() => onMove(task, "pending")} 
                  className="text-xs px-2 py-1 border rounded bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                >
                  Depriority
                </button>
              ) : (
                <button 
                  onClick={() => onMove(task, "priority")} 
                  className="text-xs px-2 py-1 border rounded hover:bg-gray-100"
                >
                  To Priority
                </button>
              )}
              
              {task.status !== "inprogress" && (
                <button 
                  onClick={() => onMove(task, "inprogress")} 
                  className="text-xs px-2 py-1 border rounded hover:bg-gray-100"
                >
                  Start
                </button>
              )}

              <button 
                onClick={() => onComplete(task)} 
                className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded hover:bg-green-200"
              >
                Complete
              </button>
            </>
          )}
          {task.status === "completed" && (
            <button onClick={() => onRestore(task)} className="text-xs px-2 py-1 border rounded hover:bg-gray-100">Restore</button>
          )}
        </div>
      </div>
    </div>
  );
}

export default TaskCard;