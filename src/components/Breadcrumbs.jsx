import React from 'react';
import './Breadcrumbs.css';

const Breadcrumbs = ({ items = [] }) => {
  if (!items || items.length === 0) return null;

  return (
    <nav className="breadcrumbs" aria-label="Навигационная цепочка">
      <ol className="breadcrumbs__list">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          
          return (
            <li 
              key={index} 
              className={`breadcrumbs__item ${isLast ? 'breadcrumbs__item--current' : ''}`}
            >
              {isLast ? (
                <span className="breadcrumbs__current">{item.label}</span>
              ) : (
                <>
                  <button 
                    className="breadcrumbs__link"
                    onClick={item.onClick}
                    aria-current={isLast ? 'page' : undefined}
                  >
                    {item.label}
                  </button>
                  <span className="breadcrumbs__separator">/</span>
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;