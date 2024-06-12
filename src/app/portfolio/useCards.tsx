import { useState, createContext, useContext, ReactNode } from "react";

type CardTypes = "send" | "receive" | "buy";

type CardsContext = {
  activeCard: CardTypes | null;
  openCard: (type: CardTypes) => void;
  closeCard: () => void;
};

const CardsContext = createContext<CardsContext>({} as CardsContext);

export const useCards = () => {
  const context = useContext(CardsContext);
  if (!context) {
    throw new Error("useCards must be used within CardsContext");
  }
  return context;
};

const CardsProvider = ({ children }: { children: ReactNode }) => {
  const [activeCard, setActiveCard] = useState<CardTypes | null>(null);
  const closeCard = () => setActiveCard(null);

  return (
    <CardsContext.Provider
      value={{
        activeCard,
        openCard: (type: CardTypes) => setActiveCard(type),
        closeCard,
      }}
    >
      {children}
    </CardsContext.Provider>
  );
};

export default CardsProvider;
