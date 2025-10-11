interface Props {
  tags?: { id: number; nombre: string }[];
  selected: number[];
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const TagsSelector = ({ tags = [], selected, onChange }: Props) => (
  <div className="mb-3">
    <label className="form-label">Tags</label>
    <div>
      {tags.map((tag) => (
        <div key={tag.id} className="form-check form-check-inline">
          <input
            className="form-check-input"
            type="checkbox"
            name="tags"
            id={`tag-${tag.id}`}
            value={tag.id}
            checked={selected.includes(tag.id)}
            onChange={onChange}
          />
          <label className="form-check-label" htmlFor={`tag-${tag.id}`}>
            {tag.nombre}
          </label>
        </div>
      ))}
    </div>
  </div>
);

export default TagsSelector;
