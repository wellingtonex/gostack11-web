import React, { useCallback, useRef, useState } from 'react';
import { FiLogIn, FiMail } from 'react-icons/fi';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';

import { Container, Content, Background, AnimationContainer } from './style';
import logoImg from '../../assets/logo.svg';

import { useToast } from '../../hooks/ToastContext';
import getValidationsErros from '../../utils/getValidationsErros';
import Button from '../../components/Button';
import Input from '../../components/Input';
import api from '../../services/api';

interface ForgotPasswordFormData {
  email: string;
}

const ForgotPassword: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const formRef = useRef<FormHandles>(null);

  const { addToast } = useToast();

  const handleSubmit = useCallback(
    async (data: ForgotPasswordFormData) => {
      try {
        setLoading(true);
        formRef.current?.setErrors({});
        const schema = Yup.object().shape({
          email: Yup.string()
            .required('E-mail obrigatório.')
            .email('Digite um e-mail válido'),
        });
        await schema.validate(data, {
          abortEarly: false,
        });

        await api.post(`/password/forgot`, { email: data.email });
        addToast({
          type: 'success',
          title: 'E-mail de recuperação de senha enviado.',
          description:
            'Enviamos um e-mail para confirmar recuperação de senha, cheque sua caixa de entrada.',
        });
      } catch (error) {
        if (error instanceof Yup.ValidationError) {
          const validationErros = getValidationsErros(error);
          formRef.current?.setErrors(validationErros);
        } else {
          addToast({
            type: 'error',
            title: 'Erro na recuperação de senha.',
            description:
              'Ocorreu um erro ao ao tentar realizar a recuperação de senha.',
          });
        }
      } finally {
        setLoading(false);
      }
    },
    [addToast],
  );

  return (
    <Container>
      <Content>
        <AnimationContainer>
          <img src={logoImg} alt="GoBarber" />

          <Form ref={formRef} onSubmit={handleSubmit}>
            <h1>Recuperar senha</h1>
            <Input name="email" icon={FiMail} placeholder="E-mail" />

            <Button loading={loading} type="submit">
              Recuperar
            </Button>
          </Form>
          <Link to="/signin">
            <FiLogIn />
            Voltar ao login
          </Link>
        </AnimationContainer>
      </Content>
      <Background />
    </Container>
  );
};

export default ForgotPassword;
