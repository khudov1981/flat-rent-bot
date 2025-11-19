import React, { useState, useEffect } from 'react';
import Button from './Button';
import './GuideTooltip.css';

const GuideTooltip = ({ 
  id,
  title,
  content,
  position = 'top',
  showOnLoad = false,
  onComplete,
  onNext,
  onPrev,
  step,
  totalSteps,
  isLastStep = false
}) => {
  const [isVisible, setIsVisible] = useState(showOnLoad);
  const [isCompleted, setIsCompleted] = useState(false);

  // Проверяем, завершён ли гайд ранее
  useEffect(() => {
    const completedGuides = JSON.parse(localStorage.getItem('completedGuides') || '[]');
    if (completedGuides.includes(id)) {
      setIsCompleted(true);
    }
  }, [id]);

  // Показываем подсказку, если гайд не завершён
  useEffect(() => {
    if (showOnLoad && !isCompleted) {
      setIsVisible(true);
    }
  }, [showOnLoad, isCompleted]);

  const handleClose = () => {
    setIsVisible(false);
  };

  const handleComplete = () => {
    // Сохраняем в localStorage, что гайд завершён
    const completedGuides = JSON.parse(localStorage.getItem('completedGuides') || '[]');
    if (!completedGuides.includes(id)) {
      completedGuides.push(id);
      localStorage.setItem('completedGuides', JSON.stringify(completedGuides));
    }
    
    setIsCompleted(true);
    setIsVisible(false);
    if (onComplete) onComplete();
  };

  if (isCompleted || !isVisible) return null;

  return (
    <div className={`guide-tooltip guide-tooltip--${position}`}>
      <div className="guide-tooltip__content">
        <div className="guide-tooltip__header">
          <h3 className="guide-tooltip__title">{title}</h3>
          <button 
            className="guide-tooltip__close"
            onClick={handleClose}
            aria-label="Закрыть подсказку"
          >
            ×
          </button>
        </div>
        <div className="guide-tooltip__body">
          <p>{content}</p>
        </div>
        <div className="guide-tooltip__footer">
          <div className="guide-tooltip__steps">
            {step && totalSteps && (
              <span className="guide-tooltip__step-indicator">
                {step} из {totalSteps}
              </span>
            )}
          </div>
          <div className="guide-tooltip__actions">
            {onPrev && (
              <Button 
                variant="secondary" 
                size="small" 
                onClick={onPrev}
              >
                Назад
              </Button>
            )}
            {isLastStep ? (
              <Button 
                variant="primary" 
                size="small" 
                onClick={handleComplete}
              >
                Завершить
              </Button>
            ) : (
              <Button 
                variant="primary" 
                size="small" 
                onClick={onNext || handleClose}
              >
                Далее
              </Button>
            )}
          </div>
        </div>
      </div>
      <div className="guide-tooltip__arrow"></div>
    </div>
  );
};

export default GuideTooltip;