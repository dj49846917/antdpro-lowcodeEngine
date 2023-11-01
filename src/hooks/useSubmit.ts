import { FormInstance } from 'antd';
import { useCallback, useRef } from 'react';

export const useSubmit = () => {
  const formRef = useRef<{ form?: FormInstance }>({});
  const onValidate = useCallback(() => {
    return formRef.current.form!.validateFields()
  }, []);
  return { formRef, onValidate }
}
