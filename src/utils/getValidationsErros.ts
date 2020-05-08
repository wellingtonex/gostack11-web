import { ValidationError } from 'yup';

interface Erros {
  [key: string]: string;
}

export default function getValidationErros(errors: ValidationError): Erros {
  const validationErros: Erros = {};

  errors.inner.forEach((error) => {
    validationErros[error.path] = error.message;
  });

  return validationErros;
}
