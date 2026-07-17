import React, { useState, useEffect, useRef } from 'react';
import { Image as ImageIcon, Upload, RotateCcw, ZoomIn, Move, Check, Loader2 } from 'lucide-react';

interface LeafConfig {
  imgUrl: string;
  scale: number;
  x: number;
  y: number;
}

interface LeavesConfig {
  topLeft: LeafConfig;
  topRight: LeafConfig;
  bottomLeft: LeafConfig;
  bottomRight: LeafConfig;
}

const PRESETS: Record<string, LeafConfig & { rotation: number; name: string; label: string }> = {
  topLeft: {
    name: 'Top Left Leaf',
    label: 'Sigiriya / Ancient Fortress Slot',
    imgUrl: '/sigiriya_uploaded.png',
    scale: 1.8,
    x: 12,
    y: 10,
    rotation: 120,
  },
  topRight: {
    name: 'Top Right Leaf',
    label: 'Dambulla Cave Temple Slot',
    imgUrl: '/dambulla_cave_temple.jpg',
    scale: 1.8,
    x: 5,
    y: 0,
    rotation: -60,
  },
  bottomLeft: {
    name: 'Bottom Left Leaf',
    label: 'Galle Lighthouse Slot',
    imgUrl: '/galle_lighthouse.jpg',
    scale: 1.8,
    x: 5,
    y: -10,
    rotation: 60,
  },
  bottomRight: {
    name: 'Bottom Right Leaf',
    label: 'Dalada Maligawa Slot',
    imgUrl: '/dalada_maligawa.jpg',
    scale: 1.7,
    x: 12,
    y: 0,
    rotation: -45,
  },
};

const LeafSettings = () => {
  const [leaves, setLeaves] = useState<LeavesConfig>({
    topLeft: { imgUrl: PRESETS.topLeft.imgUrl, scale: PRESETS.topLeft.scale, x: PRESETS.topLeft.x, y: PRESETS.topLeft.y },
    topRight: { imgUrl: PRESETS.topRight.imgUrl, scale: PRESETS.topRight.scale, x: PRESETS.topRight.x, y: PRESETS.topRight.y },
    bottomLeft: { imgUrl: PRESETS.bottomLeft.imgUrl, scale: PRESETS.bottomLeft.scale, x: PRESETS.bottomLeft.x, y: PRESETS.bottomLeft.y },
    bottomRight: { imgUrl: PRESETS.bottomRight.imgUrl, scale: PRESETS.bottomRight.scale, x: PRESETS.bottomRight.y, y: PRESETS.bottomRight.y },
  });

  const [selectedKey, setSelectedKey] = useState<keyof LeavesConfig>('topLeft');
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Dragging states
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0, leafX: 0, leafY: 0 });
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Fetch initial leaf settings from general settings
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.leaves) {
          setLeaves((prev) => ({
            ...prev,
            ...data.leaves,
          }));
        }
      })
      .catch((err) => console.error('Failed to load leaf settings', err));
  }, []);

  const selectedLeaf = leaves[selectedKey];
  const preset = PRESETS[selectedKey];

  const updateSelectedLeaf = (updates: Partial<LeafConfig>) => {
    setLeaves((prev) => ({
      ...prev,
      [selectedKey]: {
        ...prev[selectedKey],
        ...updates,
      },
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('image', file);

    try {
      setIsUploading(true);
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      if (res.ok) {
        const data = await res.json();
        updateSelectedLeaf({ imgUrl: data.imageUrl });
      } else {
        alert('Failed to upload image');
      }
    } catch (err) {
      console.error('Upload failed', err);
      alert('Error uploading image');
    } finally {
      setIsUploading(false);
    }
  };

  const handleResetToPreset = () => {
    updateSelectedLeaf({
      imgUrl: preset.imgUrl,
      scale: preset.scale,
      x: preset.x,
      y: preset.y,
    });
  };

  const handleSaveAll = async () => {
    try {
      setIsSaving(true);
      setSaveSuccess(false);

      // Fetch current settings to merge
      const settingsRes = await fetch('/api/settings');
      const currentSettings = settingsRes.ok ? await settingsRes.json() : {};

      const updatedSettings = {
        ...currentSettings,
        leaves,
      };

      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedSettings),
      });

      if (res.ok) {
        setSaveSuccess(true);
        // Dispatch event to update background in real time
        window.dispatchEvent(new Event('leaf-settings-updated'));
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        alert('Failed to save settings');
      }
    } catch (err) {
      console.error('Failed to save settings', err);
      alert('Error saving settings');
    } finally {
      setIsSaving(false);
    }
  };

  // Dragging event handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    dragStart.current = {
      x: e.clientX,
      y: e.clientY,
      leafX: selectedLeaf.x,
      leafY: selectedLeaf.y,
    };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - dragStart.current.x;
    const deltaY = e.clientY - dragStart.current.y;

    // Convert pixels to relative translation percentage
    // Damping factor accounts for current zoom/scale
    const damp = selectedLeaf.scale * 1.5;
    const newX = Math.round(dragStart.current.leafX + deltaX / damp);
    const newY = Math.round(dragStart.current.leafY + deltaY / damp);

    // Keep translation within reasonable bounds
    const clampedX = Math.max(-100, Math.min(100, newX));
    const clampedY = Math.max(-100, Math.min(100, newY));

    updateSelectedLeaf({ x: clampedX, y: clampedY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging]);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-[#fdfbf7]/10 pb-4">
        <div>
          <h3 className="text-2xl font-serif text-[#fdfbf7]">Corner Leaves Manager</h3>
          <p className="text-xs text-[#fdfbf7]/60 mt-1">Configure custom photos, zoom, and positioning for the 4 corner leaves.</p>
        </div>
        <button
          onClick={handleSaveAll}
          disabled={isSaving}
          className="mt-4 md:mt-0 bg-orange hover:bg-orange-600 text-white px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-colors disabled:opacity-50"
        >
          {isSaving ? (
            <>
              <Loader2 size={14} className="animate-spin" />
              <span>Saving...</span>
            </>
          ) : saveSuccess ? (
            <>
              <Check size={14} className="text-green-300" />
              <span>Saved Successfully!</span>
            </>
          ) : (
            <>
              <Check size={14} />
              <span>Save Configuration</span>
            </>
          )}
        </button>
      </div>

      {/* Select Leaf Slot */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {(Object.keys(PRESETS) as Array<keyof LeavesConfig>).map((key) => {
          const isSelected = selectedKey === key;
          const config = PRESETS[key];
          return (
            <button
              key={key}
              onClick={() => setSelectedKey(key)}
              className={`p-4 rounded-2xl border text-left transition-all ${
                isSelected
                  ? 'bg-orange/10 border-orange text-[#fdfbf7]'
                  : 'bg-black/20 border-[#fdfbf7]/10 hover:border-[#fdfbf7]/30 text-[#fdfbf7]/70 hover:text-[#fdfbf7]'
              }`}
            >
              <span className="text-xs block font-semibold uppercase tracking-wider text-orange mb-1">
                {config.name}
              </span>
              <span className="text-[11px] block text-[#fdfbf7]/50 truncate">{config.label}</span>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Editor Controls */}
        <div className="lg:col-span-7 bg-black/30 border border-[#fdfbf7]/10 p-6 md:p-8 rounded-3xl flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <h4 className="text-lg font-serif font-semibold text-[#fdfbf7]">
              Editing: <span className="text-orange">{preset.name}</span>
            </h4>
            <button
              onClick={handleResetToPreset}
              className="text-[11px] font-bold uppercase tracking-widest text-[#fdfbf7]/50 hover:text-orange transition-colors flex items-center gap-1.5"
            >
              <RotateCcw size={12} />
              Reset to default
            </button>
          </div>

          {/* Image Source */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase tracking-widest text-[#fdfbf7]/70">Photo Source</label>
            <div className="flex gap-3">
              <input
                type="text"
                value={selectedLeaf.imgUrl}
                onChange={(e) => updateSelectedLeaf({ imgUrl: e.target.value })}
                placeholder="https://example.com/photo.jpg"
                className="flex-1 bg-[#fdfbf7]/5 border border-[#fdfbf7]/10 rounded-xl px-4 py-2 text-sm text-[#fdfbf7] outline-none focus:border-orange/50 transition-colors"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="bg-[#fdfbf7]/10 hover:bg-[#fdfbf7]/20 text-[#fdfbf7] px-4 rounded-xl flex items-center gap-2 transition-all text-xs font-bold uppercase tracking-wider whitespace-nowrap"
              >
                {isUploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                <span>Upload</span>
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />
            </div>
          </div>

          {/* Zoom (Scale) Slider */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between text-xs font-semibold uppercase tracking-widest text-[#fdfbf7]/70">
              <span className="flex items-center gap-1.5">
                <ZoomIn size={14} className="text-orange" />
                Zoom (Scale)
              </span>
              <span className="text-orange font-mono font-normal">{selectedLeaf.scale.toFixed(2)}x</span>
            </div>
            <input
              type="range"
              min="1.0"
              max="4.0"
              step="0.05"
              value={selectedLeaf.scale}
              onChange={(e) => updateSelectedLeaf({ scale: parseFloat(e.target.value) })}
              className="w-full accent-orange cursor-pointer bg-[#fdfbf7]/10 rounded-lg appearance-none h-1.5"
            />
            <div className="flex justify-between text-[10px] text-[#fdfbf7]/40">
              <span>1.0x (No zoom)</span>
              <span>4.0x (Max zoom)</span>
            </div>
          </div>

          {/* Move X Slider */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between text-xs font-semibold uppercase tracking-widest text-[#fdfbf7]/70">
              <span className="flex items-center gap-1.5">
                <Move size={14} className="text-orange" />
                Move Horizontal (X Offset)
              </span>
              <span className="text-orange font-mono font-normal">
                {selectedLeaf.x > 0 ? `+${selectedLeaf.x}` : selectedLeaf.x}%
              </span>
            </div>
            <input
              type="range"
              min="-100"
              max="100"
              step="1"
              value={selectedLeaf.x}
              onChange={(e) => updateSelectedLeaf({ x: parseInt(e.target.value) })}
              className="w-full accent-orange cursor-pointer bg-[#fdfbf7]/10 rounded-lg appearance-none h-1.5"
            />
            <div className="flex justify-between text-[10px] text-[#fdfbf7]/40">
              <span>Left (-100%)</span>
              <span>Center (0%)</span>
              <span>Right (100%)</span>
            </div>
          </div>

          {/* Move Y Slider */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between text-xs font-semibold uppercase tracking-widest text-[#fdfbf7]/70">
              <span className="flex items-center gap-1.5">
                <Move size={14} className="text-orange" />
                Move Vertical (Y Offset)
              </span>
              <span className="text-orange font-mono font-normal">
                {selectedLeaf.y > 0 ? `+${selectedLeaf.y}` : selectedLeaf.y}%
              </span>
            </div>
            <input
              type="range"
              min="-100"
              max="100"
              step="1"
              value={selectedLeaf.y}
              onChange={(e) => updateSelectedLeaf({ y: parseInt(e.target.value) })}
              className="w-full accent-orange cursor-pointer bg-[#fdfbf7]/10 rounded-lg appearance-none h-1.5"
            />
            <div className="flex justify-between text-[10px] text-[#fdfbf7]/40">
              <span>Up (-100%)</span>
              <span>Center (0%)</span>
              <span>Down (100%)</span>
            </div>
          </div>

          <div className="bg-orange/5 border border-orange/10 p-4 rounded-2xl text-[11px] text-[#fdfbf7]/70 leading-relaxed">
            <span className="font-bold text-orange uppercase tracking-wider block mb-1">💡 Pro Tip</span>
            You can drag directly on the leaf preview image to the right to visually adjust the horizontal and vertical positions of the photo!
          </div>
        </div>

        {/* Live Preview Column */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#fdfbf7]/70 mb-4 block">
            Real-time Live Leaf Preview
          </span>

          <div className="relative w-72 h-72 bg-black/40 border border-[#fdfbf7]/10 rounded-3xl overflow-hidden flex items-center justify-center checkerboard-bg">
            {/* Background pattern for grid visibility */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fdfbf7_1px,transparent_1px)] [background-size:16px_16px]"></div>

            {/* Simulated rotated frame resembling actual corner placements */}
            <div
              ref={previewRef}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              className={`relative w-64 h-64 overflow-hidden select-none cursor-grab active:cursor-grabbing`}
              style={{
                WebkitMaskImage: 'url("/leaf.png")',
                maskImage: 'url("/leaf.png")',
                WebkitMaskSize: 'cover',
                maskSize: 'cover',
                WebkitMaskPosition: 'top',
                maskPosition: 'top',
                WebkitMaskRepeat: 'no-repeat',
                maskRepeat: 'no-repeat',
                transform: `rotate(${preset.rotation}deg)`,
              }}
            >
              {/* Inner container counter-rotated so image is straight relative to screen */}
              <div
                className="absolute inset-0 w-full h-full pointer-events-none"
                style={{
                  transform: `rotate(${-preset.rotation}deg)`,
                }}
              >
                <img
                  src={selectedLeaf.imgUrl}
                  alt="Preview"
                  className="absolute inset-0 w-full h-full object-cover origin-center"
                  style={{
                    transform: `scale(${selectedLeaf.scale}) translate(${selectedLeaf.x}%, ${selectedLeaf.y}%)`,
                  }}
                  draggable={false}
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    // Fallback to placeholder if url is broken
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1501854140801-50d01698950b?q=80&w=600';
                  }}
                />
              </div>

              {/* Mask overlay to show leaf details/veins on top */}
              <img
                src="/leaf.png"
                alt=""
                className="absolute inset-0 w-full h-full object-cover object-top opacity-30 dark:opacity-45 mix-blend-overlay pointer-events-none"
                draggable={false}
              />
            </div>
            
            <div className="absolute bottom-3 left-3 right-3 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] text-[#fdfbf7]/60 text-center pointer-events-none">
              Rotated {preset.rotation}° (Matches actual corner)
            </div>
          </div>
          
          <span className="text-[11px] text-[#fdfbf7]/40 mt-3 text-center">
            {preset.name} utilizes a mask with a {preset.rotation}° corner rotation.
          </span>
        </div>
      </div>
    </div>
  );
};

export default LeafSettings;
