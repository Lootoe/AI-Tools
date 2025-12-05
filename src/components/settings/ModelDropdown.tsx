import React from 'react';
import { useModelStore } from '@/stores/modelStore';
import { AVAILABLE_MODELS } from '@/types/models';
import { Select } from '@/components/ui/Select';

export const ModelDropdown: React.FC = () => {
  const { currentModel, setModel } = useModelStore();

  const handleModelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedModel = AVAILABLE_MODELS.find(m => m.id === e.target.value);
    if (selectedModel) {
      setModel(selectedModel);
    }
  };

  return (
    <Select
      value={currentModel.id}
      onChange={handleModelChange}
      className="min-w-[180px]"
    >
      {AVAILABLE_MODELS.map((model) => (
        <option key={model.id} value={model.id}>
          {model.name}
        </option>
      ))}
    </Select>
  );
};
