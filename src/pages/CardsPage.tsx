import React from 'react';
import { useCards } from '@/hooks/useAccounts';
import { VirtualCardDisplay } from '@/components/cards/VirtualCardDisplay';
import { CardControls } from '@/components/cards/CardControls';
import { BurnerCardsSection } from '@/components/cards/BurnerCardsSection';
import { FamilyCardSection } from '@/components/cards/FamilyCardSection';
import { Button } from '@/components/ui/Button';
import { Plus } from 'lucide-react';
import { api } from '@/services/api';
import { useQueryClient } from '@tanstack/react-query';

export function CardsPage() {
  const { data: cards = [], isLoading } = useCards();
  const queryClient = useQueryClient();
  const [isIssuing, setIsIssuing] = React.useState(false);

  const handleCardUpdate = async (cardId: string, updates: any) => {
    await api.updateCard(cardId, updates);
    queryClient.invalidateQueries({ queryKey: ['cards'] });
  };

  const primaryCard = cards.find(c => c.type !== 'BURNER');

  const handleIssueCard = async () => {
    setIsIssuing(true);
    try {
      await api.issueVirtualCard();
      queryClient.invalidateQueries({ queryKey: ['cards'] });
    } catch (error) {
      console.error(error);
    } finally {
      setIsIssuing(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex justify-between items-center animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Cards</h1>
          <p className="text-gray-400 mt-1">Manage your virtual, physical, and burner cards.</p>
        </div>
        <Button onClick={handleIssueCard} disabled={isIssuing}>
          {isIssuing ? (
            'Issuing...'
          ) : (
            <>
              <Plus className="h-4 w-4 mr-2" />
              Issue New Card
            </>
          )}
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-48 w-80 bg-white/5 rounded-2xl mb-4"></div>
            <div className="h-4 w-32 bg-white/5 rounded"></div>
          </div>
        </div>
      ) : (
        <>
          {primaryCard ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mb-12">
              <div className="flex flex-col items-center justify-center py-8 animate-slide-up stagger-1">
                <VirtualCardDisplay card={primaryCard} />
                <p className="text-sm text-gray-500 mt-8 text-center max-w-xs">
                  Click the card to flip and view CVV. Click the eye icon to reveal the full card number.
                </p>
              </div>
              
              <div className="animate-slide-up stagger-2">
                <CardControls 
                  card={primaryCard} 
                  onUpdate={(updates) => handleCardUpdate(primaryCard.id, updates)} 
                />
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              No standard cards found.
            </div>
          )}

          <div className="animate-slide-up stagger-3 mb-12">
            <BurnerCardsSection cards={cards} />
          </div>

          <div className="animate-slide-up stagger-4">
            <FamilyCardSection />
          </div>
        </>
      )}
    </div>
  );
}
