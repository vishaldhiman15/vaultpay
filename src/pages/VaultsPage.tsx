import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Target, Plus, PiggyBank, ArrowRight, Loader2 } from 'lucide-react';
import { api } from '../services/api';

export function VaultsPage() {
  const [vaults, setVaults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewVault, setShowNewVault] = useState(false);
  const [newVaultName, setNewVaultName] = useState('');
  const [newVaultTarget, setNewVaultTarget] = useState('');

  useEffect(() => {
    fetchVaults();
  }, []);

  const fetchVaults = async () => {
    try {
      const response = await api.client.get('/vaults');
      setVaults(response.data.vaults);
    } catch (err) {
      console.error('Failed to fetch vaults:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateVault = async () => {
    if (!newVaultName || !newVaultTarget) return;
    try {
      await api.client.post('/vaults', {
        name: newVaultName,
        targetAmount: Number(newVaultTarget)
      });
      setShowNewVault(false);
      setNewVaultName('');
      setNewVaultTarget('');
      fetchVaults();
    } catch (err) {
      console.error('Failed to create vault:', err);
    }
  };

  const handleAddMoney = async (id: string) => {
    const amount = prompt("How much do you want to add?");
    if (!amount) return;
    
    try {
      await api.client.post(`/vaults/${id}/add`, { amount: Number(amount) });
      fetchVaults();
    } catch (err) {
      console.error('Failed to add money:', err);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto p-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground flex items-center gap-2">
            <PiggyBank className="text-accent h-6 w-6" /> 
            Savings Vaults
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">Create goals and automate your savings.</p>
        </div>
        <Button onClick={() => setShowNewVault(!showNewVault)} className="bg-primary hover:bg-primary/90 text-primary-foreground">
          <Plus size={18} className="mr-2" /> New Vault
        </Button>
      </div>

      {showNewVault && (
        <Card className="bg-card border-white/10 shadow-sm animate-scale-in">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Target size={18} className="text-accent" />
              Create a New Goal
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Goal Name</label>
              <Input 
                value={newVaultName}
                onChange={e => setNewVaultName(e.target.value)}
                placeholder="e.g. Dream Vacation, New Car..."
                className="bg-black/20 border-white/10"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Target Amount (INR)</label>
              <Input 
                type="number"
                value={newVaultTarget}
                onChange={e => setNewVaultTarget(e.target.value)}
                placeholder="e.g. 50000"
                className="bg-black/20 border-white/10"
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="ghost" onClick={() => setShowNewVault(false)}>Cancel</Button>
              <Button onClick={handleCreateVault} className="bg-primary hover:bg-primary/90">Create Goal</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <div className="flex justify-center p-12"><Loader2 className="animate-spin text-accent" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {vaults.length === 0 && !showNewVault && (
            <div className="col-span-2 text-center p-12 text-muted-foreground border border-white/5 rounded-2xl bg-white/5">
              <PiggyBank size={48} className="mx-auto mb-4 opacity-50" />
              <p>You have no active savings vaults.</p>
              <Button variant="link" onClick={() => setShowNewVault(true)} className="mt-2 text-accent">Create your first goal</Button>
            </div>
          )}
          {vaults.map((vault) => (
            <Card key={vault.id} className="bg-card border-white/10 shadow-sm overflow-hidden hover:border-accent/50 transition-colors">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-lg">{vault.name}</h3>
                    <p className="text-xs text-muted-foreground">Target: ₹{vault.targetAmount.toLocaleString()}</p>
                  </div>
                  <div className="p-2 bg-accent/10 rounded-full">
                    <Target size={20} className="text-accent" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm font-medium">
                    <span>₹{vault.savedAmount.toLocaleString()}</span>
                    <span className="text-accent">{Math.round((vault.savedAmount / vault.targetAmount) * 100)}%</span>
                  </div>
                  <div className="w-full bg-black/40 rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-accent h-full rounded-full transition-all duration-500 ease-out" 
                      style={{ width: `${Math.min((vault.savedAmount / vault.targetAmount) * 100, 100)}%` }}
                    />
                  </div>
                </div>
                
                <div className="mt-6">
                  <Button onClick={() => handleAddMoney(vault.id)} variant="outline" className="w-full text-xs font-medium bg-white/5 hover:bg-white/10 border-white/10">
                    Add Money <ArrowRight size={14} className="ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
