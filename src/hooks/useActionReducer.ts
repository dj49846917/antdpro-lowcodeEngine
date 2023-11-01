import { useReducer } from "react";

export type ActionPayload = {type: string; data?: any};

export const useActionReducer = () => {

  function reducer(state: ActionPayload, payload: ActionPayload): ActionPayload {
    switch (payload.type) {
      case 'create':
        return payload;
      case 'view':
        return payload;
      case 'delete':
        return payload;
      default:
        return payload;
    }
  }

  const [state, dispatch] = useReducer(reducer, {type: 'create'});

  return {state, dispatch};
}
