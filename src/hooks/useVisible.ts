import {
  useCallback,
  useState
} from "react";

export const useVisible = (defaultValue: boolean = false) => {
  const [visible, setVisible] = useState(defaultValue);

  const handleVisible = useCallback((isVisible: boolean) => {
    setVisible(isVisible);
  }, []);
  const onClose = useCallback(() => {
    setVisible(false);
  }, []);
  const onOpen = useCallback(() => {
    setVisible(true);
  }, []);
  return {
    visible,
    handleVisible,
    onClose,
    onOpen
  };
}
