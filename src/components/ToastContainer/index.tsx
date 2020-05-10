import React from 'react';

import { Container } from './styles';
import { ToastMessage } from '../../hooks/ToastContext';
import Toast from './Toast';

interface ToastContatinerProps {
  messages: ToastMessage[];
}

const ToastContatiner: React.FC<ToastContatinerProps> = ({ messages }) => {
  return (
    <Container>
      {messages.map((message) => (
        <Toast key={message.id} message={message}></Toast>
      ))}
    </Container>
  );
};

export default ToastContatiner;
