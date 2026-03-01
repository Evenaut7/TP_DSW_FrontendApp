import { useState } from 'react';

interface Props {
  tags?: { id: number; nombre: string }[];
  selected: number[];
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const TAGS_VISIBLE = 6;

const TagsSelector = ({ tags = [], selected, onChange }: Props) => {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? tags : tags.slice(0, TAGS_VISIBLE);
  const hasMore = tags.length > TAGS_VISIBLE;

  const handleToggle = (tagId: number) => {
    const fakeEvent = {
      target: {
        name: 'tags',
        type: 'checkbox',
        value: String(tagId),
        checked: !selected.includes(tagId),
      },
    } as React.ChangeEvent<HTMLInputElement>;
    onChange(fakeEvent);
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
        Tags
      </label>
      <div className="flex flex-wrap gap-2">
        {visible.map((tag) => (
          <button
            key={tag.id}
            type="button"
            onClick={() => handleToggle(tag.id)}
            className={`px-3 py-1 rounded-full text-sm font-medium border transition-all
              ${
                selected.includes(tag.id)
                  ? 'bg-primary border-primary text-white'
                  : 'border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-300 hover:border-primary hover:text-primary'
              }`}
          >
            #{tag.nombre}
          </button>
        ))}
        {hasMore && (
          <button
            type="button"
            onClick={() => setShowAll((v) => !v)}
            className="px-3 py-1 rounded-full text-sm font-medium border border-dashed border-slate-300 dark:border-slate-600 text-slate-400 dark:text-slate-500 hover:border-primary hover:text-primary transition-all"
          >
            {showAll ? 'Ver menos' : `+${tags.length - TAGS_VISIBLE} más`}
          </button>
        )}
      </div>
    </div>
  );
};

export default TagsSelector;
