import React, {useState, useContext} from 'react';

const ConversationsContext = React.createContext();

export function useConverstions() {
  return useContext(ConversationsContext);
}

export function ConversationProvider({children}) {
  const [conversations, setConversations] = useState([0, 1, 2]);

  const value = {
    conversations,
  };
  
  return (
    <ConversationsContext.Provider value={value}>
      {children}
    </ConversationsContext.Provider>
  );
}
