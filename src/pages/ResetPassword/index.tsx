import React, { useCallback, useRef } from 'react';
import { FiLock } from 'react-icons/fi';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';
import { useHistory, useLocation } from 'react-router-dom';

import { Container, Content, Background, AnimationContainer } from './style';
import logoImg from '../../assets/logo.svg';

import { useToast } from '../../hooks/ToastContext';
import getValidationsErros from '../../utils/getValidationsErros';
import Button from '../../components/Button';
import Input from '../../components/Input';
import api from '../../services/api';

interface ResetPasswordFormData {
  password: string;
  password_confirmation: string;
}

const ResetPassword: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const history = useHistory();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const token = params.get('token');

  if (!token) {
    throw new Error('Token inexistente.');
  }

  const { addToast } = useToast();

  const handleSubmit = useCallback(
    async (data: ResetPasswordFormData) => {
      try {
        formRef.current?.setErrors({});
        const schema = Yup.object().shape({
          password: Yup.string().required('Senha obrigatório.'),
          password_confirmation: Yup.string().oneOf(
            [Yup.ref('password'), null],
            'Confirmação incorreta.',
          ),
        });
        await schema.validate(data, {
          abortEarly: false,
        });

        await api.post('/password/reset', {
          password: data.password,
          password_confirmation: data.password_confirmation,
          token,
        });

        history.push('/');
      } catch (error) {
        if (error instanceof Yup.ValidationError) {
          const validationErros = getValidationsErros(error);
          formRef.current?.setErrors(validationErros);
        } else {
          addToast({
            type: 'error',
            title: 'Erro ao resetar senha.',
            description: 'Ocorreu um erro ao resetar sua senha.',
          });
        }
      }
    },
    [addToast, history, token],
  );

  return (
    <Container>
      <Content>
        <AnimationContainer>
          <img src={logoImg} alt="GoBarber" />

          <Form ref={formRef} onSubmit={handleSubmit}>
            <h1>Resetar Senha</h1>
            <Input
              name="password"
              icon={FiLock}
              type="password"
              placeholder="Nova senha"
            />

            <Input
              name="password_confirmation"
              icon={FiLock}
              type="password"
              placeholder="Confirmação da senha"
            />

            <Button type="submit">Alterar senha</Button>
          </Form>
        </AnimationContainer>
      </Content>
      <Background />
    </Container>
  );
};

export default ResetPassword;
