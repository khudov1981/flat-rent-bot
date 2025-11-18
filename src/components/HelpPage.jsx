import React, { useState } from 'react';
import Card from './Card';
import Button from './Button';
import './HelpPage.css';

const HelpPage = () => {
  const [expandedFAQ, setExpandedFAQ] = useState(null);

  const faqs = [
    {
      id: 1,
      question: 'Как добавить новый объект размещения?',
      answer: 'Перейдите на вкладку "Объекты размещения" и нажмите кнопку "Добавить объект". Заполните форму с информацией об объекте и нажмите "Добавить объект".'
    },
    {
      id: 2,
      question: 'Как забронировать даты для объекта?',
      answer: 'Выберите объект размещения, перейдите на вкладку "Календарь", выберите нужные даты и введите данные клиента.'
    },
    {
      id: 3,
      question: 'Как изменить информацию об объекте?',
      answer: 'Перейдите на вкладку "Объекты размещения", найдите нужный объект и нажмите кнопку с карандашом для редактирования.'
    },
    {
      id: 4,
      question: 'Как удалить объект размещения?',
      answer: 'Перейдите на вкладку "Объекты размещения", найдите нужный объект и нажмите кнопку с корзиной. Подтвердите удаление в диалоговом окне.'
    },
    {
      id: 5,
      question: 'Где хранятся данные приложения?',
      answer: 'Все данные хранятся локально на вашем устройстве в браузере. При необходимости вы можете экспортировать данные или очистить их в настройках.'
    }
  ];

  const toggleFAQ = (id) => {
    setExpandedFAQ(expandedFAQ === id ? null : id);
  };

  return (
    <div className="help-page">
      <div className="page-header">
        <h2>Помощь и поддержка</h2>
      </div>
      
      <Card className="help-card">
        <h3>Часто задаваемые вопросы</h3>
        
        <div className="faq-list">
          {faqs.map((faq) => (
            <div key={faq.id} className="faq-item">
              <div 
                className="faq-question"
                onClick={() => toggleFAQ(faq.id)}
              >
                <span>{faq.question}</span>
                <span className={`faq-toggle ${expandedFAQ === faq.id ? 'expanded' : ''}`}>
                  {expandedFAQ === faq.id ? '−' : '+'}
                </span>
              </div>
              
              {expandedFAQ === faq.id && (
                <div className="faq-answer">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>
      
      <Card className="help-card">
        <h3>Связаться с нами</h3>
        
        <div className="contact-info">
          <p>Если у вас есть вопросы или предложения, вы можете связаться с нами следующими способами:</p>
          
          <div className="contact-method">
            <span className="contact-icon">📧</span>
            <div>
              <strong>Email поддержки:</strong>
              <p>support@flatrentbot.com</p>
            </div>
          </div>
          
          <div className="contact-method">
            <span className="contact-icon">💬</span>
            <div>
              <strong>Telegram:</strong>
              <p>@flatrent_support</p>
            </div>
          </div>
          
          <div className="contact-method">
            <span className="contact-icon">📱</span>
            <div>
              <strong>Телефон:</strong>
              <p>+7 (495) 123-45-67</p>
            </div>
          </div>
        </div>
      </Card>
      
      <Card className="help-card">
        <h3>Отправить сообщение</h3>
        
        <div className="feedback-form">
          <div className="form-group">
            <label>Тема:</label>
            <select className="feedback-select">
              <option>Общие вопросы</option>
              <option>Техническая поддержка</option>
              <option>Предложения по улучшению</option>
              <option>Сообщить об ошибке</option>
            </select>
          </div>
          
          <div className="form-group">
            <label>Сообщение:</label>
            <textarea 
              className="feedback-textarea"
              rows="5"
              placeholder="Опишите ваш вопрос или проблему..."
            ></textarea>
          </div>
          
          <Button variant="primary">
            Отправить сообщение
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default HelpPage;