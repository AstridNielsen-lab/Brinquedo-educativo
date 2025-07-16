import React, { useState } from 'react';
import { RotateCw, RefreshCw, Play, Pause, Plus, Trash2 } from 'lucide-react';

interface Block {
  id: string;
  type: 'cube' | 'pyramid' | 'sphere' | 'cylinder';
  color: string;
  x: number;
  y: number;
  rotation: number;
  connected: boolean;
}

const colors = [
  { name: 'Vermelho', value: '#E53E3E', shadow: '#C53030' },
  { name: 'Azul', value: '#3182CE', shadow: '#2B6CB0' },
  { name: 'Amarelo', value: '#F6E05E', shadow: '#ECC94B' },
  { name: 'Verde', value: '#38A169', shadow: '#2F855A' },
  { name: 'Laranja', value: '#FF8C00', shadow: '#FF7F00' },
  { name: 'Roxo', value: '#805AD5', shadow: '#6B46C1' }
];

const blockTypes = [
  { type: 'cube' as const, name: 'Cubo', icon: '⬜' },
  { type: 'pyramid' as const, name: 'Pirâmide', icon: '🔺' },
  { type: 'sphere' as const, name: 'Esfera', icon: '⚪' },
  { type: 'cylinder' as const, name: 'Cilindro', icon: '🟡' }
];

function App() {
  const [blocks, setBlocks] = useState<Block[]>([
    { id: '1', type: 'cube', color: colors[0].value, x: 200, y: 200, rotation: 0, connected: true },
    { id: '2', type: 'cube', color: colors[1].value, x: 200, y: 150, rotation: 0, connected: true },
    { id: '3', type: 'pyramid', color: colors[2].value, x: 200, y: 100, rotation: 0, connected: true },
    { id: '4', type: 'sphere', color: colors[3].value, x: 350, y: 180, rotation: 0, connected: false },
    { id: '5', type: 'cylinder', color: colors[4].value, x: 400, y: 250, rotation: 45, connected: false },
    { id: '6', type: 'cube', color: colors[5].value, x: 150, y: 300, rotation: 0, connected: false },
  ]);

  const [isAnimating, setIsAnimating] = useState(false);
  const [selectedType, setSelectedType] = useState<'cube' | 'pyramid' | 'sphere' | 'cylinder'>('cube');
  const [selectedColor, setSelectedColor] = useState(colors[0].value);
  const [draggedBlock, setDraggedBlock] = useState<string | null>(null);

  const getBlockStyle = (block: Block) => {
    const colorObj = colors.find(c => c.value === block.color);
    const shadowColor = colorObj?.shadow || '#000';
    
    return {
      position: 'absolute' as const,
      left: `${block.x}px`,
      top: `${block.y}px`,
      transform: `rotate(${block.rotation}deg)`,
      transition: draggedBlock === block.id ? 'none' : 'all 0.3s ease',
      filter: block.connected ? 'brightness(1.1)' : 'brightness(1)',
      cursor: 'pointer',
      zIndex: block.connected ? 10 : 5,
    };
  };

  const handleBlockClick = (blockId: string) => {
    setBlocks(blocks.map(block => 
      block.id === blockId 
        ? { ...block, rotation: block.rotation + 90 }
        : block
    ));
  };

  const handleMouseDown = (e: React.MouseEvent, blockId: string) => {
    e.preventDefault();
    setDraggedBlock(blockId);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (draggedBlock) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left - 24; // Offset para centralizar
      const y = e.clientY - rect.top - 24;
      
      setBlocks(blocks.map(block => 
        block.id === draggedBlock 
          ? { ...block, x: Math.max(0, Math.min(x, 552)), y: Math.max(0, Math.min(y, 452)) }
          : block
      ));
    }
  };

  const handleMouseUp = () => {
    setDraggedBlock(null);
  };

  const addNewBlock = () => {
    const newBlock: Block = {
      id: Date.now().toString(),
      type: selectedType,
      color: selectedColor,
      x: Math.random() * 400 + 100,
      y: Math.random() * 300 + 100,
      rotation: 0,
      connected: false
    };
    setBlocks([...blocks, newBlock]);
  };

  const removeBlock = (blockId: string) => {
    setBlocks(blocks.filter(block => block.id !== blockId));
  };

  const shuffleBlocks = () => {
    setBlocks(blocks.map(block => ({
      ...block,
      x: Math.random() * 400 + 100,
      y: Math.random() * 300 + 100,
      rotation: Math.random() * 360,
      connected: Math.random() > 0.5
    })));
  };

  const toggleAnimation = () => {
    setIsAnimating(!isAnimating);
  };

  const resetBlocks = () => {
    setBlocks([
      { id: '1', type: 'cube', color: colors[0].value, x: 200, y: 200, rotation: 0, connected: true },
      { id: '2', type: 'cube', color: colors[1].value, x: 200, y: 150, rotation: 0, connected: true },
      { id: '3', type: 'pyramid', color: colors[2].value, x: 200, y: 100, rotation: 0, connected: true },
      { id: '4', type: 'sphere', color: colors[3].value, x: 350, y: 180, rotation: 0, connected: false },
      { id: '5', type: 'cylinder', color: colors[4].value, x: 400, y: 250, rotation: 45, connected: false },
      { id: '6', type: 'cube', color: colors[5].value, x: 150, y: 300, rotation: 0, connected: false },
    ]);
  };

  const clearAllBlocks = () => {
    setBlocks([]);
  };

  const renderBlock = (block: Block) => {
    const colorObj = colors.find(c => c.value === block.color);
    const shadowColor = colorObj?.shadow || '#000';
    
    const commonStyles = {
      background: `linear-gradient(135deg, ${block.color} 0%, ${shadowColor} 100%)`,
      border: `2px solid rgba(255, 255, 255, 0.3)`,
      boxShadow: `
        0 8px 16px rgba(0, 0, 0, 0.2),
        inset 0 2px 4px rgba(255, 255, 255, 0.4),
        inset 0 -2px 4px rgba(0, 0, 0, 0.2)
      `,
      borderRadius: block.type === 'sphere' ? '50%' : '4px',
    };

    const blockElement = (() => {
      switch (block.type) {
        case 'cube':
          return (
            <div
              style={{
                width: '48px',
                height: '48px',
                ...commonStyles,
              }}
              className="hover:scale-105 transition-transform duration-200"
            >
              {block.connected && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-2 h-2 bg-gray-600 rounded-full opacity-60"></div>
                </div>
              )}
            </div>
          );
        
        case 'pyramid':
          return (
            <div
              style={{
                width: '0',
                height: '0',
                borderLeft: '24px solid transparent',
                borderRight: '24px solid transparent',
                borderBottom: `48px solid ${block.color}`,
                background: 'none',
                border: 'none',
                boxShadow: `0 8px 16px rgba(0, 0, 0, 0.2)`,
                filter: `drop-shadow(0 0 4px ${shadowColor})`,
              }}
              className="hover:scale-105 transition-transform duration-200"
            />
          );
        
        case 'sphere':
          return (
            <div
              style={{
                width: '48px',
                height: '48px',
                ...commonStyles,
                background: `radial-gradient(circle at 30% 30%, ${block.color} 0%, ${shadowColor} 100%)`,
              }}
              className="hover:scale-105 transition-transform duration-200"
            >
              {block.connected && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-2 h-2 bg-gray-600 rounded-full opacity-60"></div>
                </div>
              )}
            </div>
          );
        
        case 'cylinder':
          return (
            <div
              style={{
                width: '48px',
                height: '48px',
                ...commonStyles,
                borderRadius: '50%',
                background: `linear-gradient(135deg, ${block.color} 0%, ${shadowColor} 100%)`,
                position: 'relative',
              }}
              className="hover:scale-105 transition-transform duration-200"
            >
              <div
                style={{
                  position: 'absolute',
                  top: '4px',
                  left: '4px',
                  right: '4px',
                  height: '8px',
                  background: `linear-gradient(90deg, ${block.color} 0%, rgba(255, 255, 255, 0.4) 50%, ${shadowColor} 100%)`,
                  borderRadius: '50%',
                }}
              />
              {block.connected && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-2 h-2 bg-gray-600 rounded-full opacity-60"></div>
                </div>
              )}
            </div>
          );
        
        default:
          return null;
      }
    })();

    return (
      <div
        key={block.id}
        style={getBlockStyle(block)}
        onMouseDown={(e) => handleMouseDown(e, block.id)}
        onClick={() => handleBlockClick(block.id)}
        className="group relative"
      >
        {blockElement}
        <button
          onClick={(e) => {
            e.stopPropagation();
            removeBlock(block.id);
          }}
          className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center text-xs hover:bg-red-600"
        >
          ×
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Blocos Magnéticos Infantis
          </h1>
          <p className="text-gray-600 text-lg">
            Brinquedo educativo com formas geométricas coloridas e conexões magnéticas
          </p>
        </div>

        {/* Controles */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <div className="flex flex-wrap gap-4 justify-center">
            <button
              onClick={shuffleBlocks}
              className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors shadow-lg"
            >
              <RefreshCw size={20} />
              Embaralhar Blocos
            </button>
            <button
              onClick={resetBlocks}
              className="flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors shadow-lg"
            >
              <RotateCw size={20} />
              Resetar Construção
            </button>
            <button
              onClick={clearAllBlocks}
              className="flex items-center gap-2 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors shadow-lg"
            >
              <Trash2 size={20} />
              Limpar Tudo
            </button>
            <button
              onClick={toggleAnimation}
              className="flex items-center gap-2 px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors shadow-lg"
            >
              {isAnimating ? <Pause size={20} /> : <Play size={20} />}
              {isAnimating ? 'Pausar' : 'Animar'} Blocos
            </button>
          </div>
          
          <div className="mt-4 text-center">
            <p className="text-gray-600 text-sm">
              Total de blocos: <span className="font-semibold text-blue-600">{blocks.length}</span>
            </p>
          </div>
        </div>

        {/* Área de Construção */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <div 
            className="relative bg-gradient-to-br from-gray-50 to-white rounded-xl border-4 border-gray-200 overflow-hidden select-none"
            style={{ 
              height: '500px',
              backgroundImage: `
                radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
                radial-gradient(circle at 80% 80%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)
              `
            }}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <div className={`absolute inset-0 ${isAnimating ? 'animate-pulse' : ''}`}>
              {blocks.map(renderBlock)}
            </div>
            
            {/* Conectores magnéticos visuais */}
            <div className="absolute top-2 left-2 right-2 bottom-2 pointer-events-none">
              <div className="absolute top-1/3 left-1/3 w-1 h-1 bg-gray-400 rounded-full animate-ping"></div>
              <div className="absolute top-1/2 left-1/2 w-1 h-1 bg-gray-400 rounded-full animate-ping delay-100"></div>
              <div className="absolute bottom-1/3 right-1/3 w-1 h-1 bg-gray-400 rounded-full animate-ping delay-200"></div>
            </div>

            {blocks.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <Plus size={48} className="mx-auto mb-4 opacity-50" />
                  <p className="text-lg">Adicione blocos para começar a construir!</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Painel de Criação de Blocos */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Criar Novo Bloco</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Seleção de Forma */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Forma</label>
              <div className="grid grid-cols-2 gap-2">
                {blockTypes.map((type) => (
                  <button
                    key={type.type}
                    onClick={() => setSelectedType(type.type)}
                    className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                      selectedType === type.type
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-2xl mb-1">{type.icon}</div>
                    <div className="text-xs">{type.name}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Seleção de Cor */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Cor</label>
              <div className="grid grid-cols-3 gap-2">
                {colors.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => setSelectedColor(color.value)}
                    className={`w-12 h-12 rounded-lg border-4 transition-all duration-200 ${
                      selectedColor === color.value
                        ? 'border-gray-800 scale-110'
                        : 'border-white hover:border-gray-300'
                    }`}
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            {/* Botão de Adicionar */}
            <div className="flex flex-col justify-end">
              <button
                onClick={addNewBlock}
                className="flex items-center justify-center gap-2 px-6 py-4 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors shadow-lg font-medium"
              >
                <Plus size={20} />
                Adicionar Bloco
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Formas Disponíveis</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-blue-500 rounded border-2 border-white shadow-md"></div>
                <span className="text-gray-700">Cubos - Blocos básicos para construção</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-0 h-0 border-l-3 border-r-3 border-b-6 border-l-transparent border-r-transparent border-b-green-500"></div>
                <span className="text-gray-700">Pirâmides - Para telhados e pontas</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-red-500 rounded-full border-2 border-white shadow-md"></div>
                <span className="text-gray-700">Esferas - Elementos decorativos</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-yellow-500 rounded-full border-2 border-white shadow-md"></div>
                <span className="text-gray-700">Cilindros - Colunas e suportes</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Cores Disponíveis</h3>
            <div className="grid grid-cols-2 gap-3">
              {colors.map((color, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div 
                    className="w-8 h-8 rounded-lg border-2 border-white shadow-md"
                    style={{ backgroundColor: color.value }}
                  ></div>
                  <span className="text-gray-700">{color.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-600 text-sm">
            Arraste os blocos para movê-los • Clique para rotacionar • Passe o mouse sobre um bloco para removê-lo
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;