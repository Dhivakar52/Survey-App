import React, { useRef, useEffect } from 'react';
import { MoreVertical, Eye, Edit, Trash2, History } from 'lucide-react';

const ActionMenu = ({ 
  item, 
  onView, 
  onEdit, 
  onDelete, 
  onAuditLog,
  openMenuId,
  setOpenMenuId 
}) => {
  const menuRef = useRef(null);
  const isOpen = openMenuId === item.id;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [setOpenMenuId]);

  const toggleMenu = (e) => {
    e.stopPropagation();
    setOpenMenuId(isOpen ? null : item.id);
  };

  return (
    <div className="position-relative" ref={menuRef}>
      <button
        onClick={toggleMenu}
        className="btn btn-sm btn-outline-secondary rounded-circle p-1"
        style={{ width: '32px', height: '32px' }}
      >
        <MoreVertical size={16} />
      </button>

      {isOpen && (
        <div
          className="position-absolute end-0 mt-1 bg-white rounded-3 shadow-lg border"
          style={{ 
            zIndex: 9999, 
            minWidth: '160px',
            top: '100%',
          }}
        >
          {onView && (
            <button
              onClick={() => {
                setOpenMenuId(null);
                onView(item);
              }}
              className="d-flex align-items-center gap-2 w-100 px-3 py-2 border-0 bg-transparent"
              style={{ cursor: 'pointer' }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#f8f9fa'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              <Eye size={16} />
              <span>View</span>
            </button>
          )}
          {onEdit && (
            <button
              onClick={() => {
                setOpenMenuId(null);
                onEdit(item);
              }}
              className="d-flex align-items-center gap-2 w-100 px-3 py-2 border-0 bg-transparent"
              style={{ cursor: 'pointer' }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#f8f9fa'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              <Edit size={16} />
              <span>Edit</span>
            </button>
          )}
          {onAuditLog && (
            <button
              onClick={() => {
                setOpenMenuId(null);
                onAuditLog(item);
              }}
              className="d-flex align-items-center gap-2 w-100 px-3 py-2 border-0 bg-transparent"
              style={{ cursor: 'pointer' }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#f8f9fa'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              <History size={16} />
              <span>Audit Log</span>
            </button>
          )}
          {onDelete && (
            <>
              <hr className="my-1" />
              <button
                onClick={() => {
                  setOpenMenuId(null);
                  onDelete(item);
                }}
                className="d-flex align-items-center gap-2 w-100 px-3 py-2 border-0 bg-transparent text-danger"
                style={{ cursor: 'pointer' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#ffebee';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                <Trash2 size={16} />
                <span>Delete</span>
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ActionMenu;