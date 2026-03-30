import { useLocale } from '@/shared/hooks'

const CATEGORY_KEYS = [
  {
    catKey: 'conceptCatReactCore',
    items: [
      'useState', 'useEffect', 'useRef', 'useReducer', 'useCallback',
      'useMemo', 'useContext', 'Custom Hooks', 'Props', 'JSX',
      'Conditional Render', 'List Rendering',
    ],
  },
  {
    catKey: 'conceptCatRedux',
    items: [
      'configureStore', 'createSlice', 'useSelector', 'useDispatch',
      'Action Creators', 'Selectors', 'Immer', 'Reducers',
    ],
  },
  {
    catKey: 'conceptCatZustand',
    items: [
      'create()', 'persist middleware', 'devtools', 'Selectors',
      'Actions', 'get() / set()', 'vs Redux',
    ],
  },
  {
    catKey: 'conceptCatRouter',
    items: [
      'BrowserRouter', 'Routes / Route', 'NavLink', 'useNavigate',
      'useLocation', 'useParams', 'Nested Routes', 'Outlet',
    ],
  },
]

export default function ConceptsOverview() {
  const { t } = useLocale()

  return (
    <div className="concepts-overview">
      <h2 className="section-title">{t('homeConceptsOverviewTitle')}</h2>
      <div className="concepts-grid">
        {CATEGORY_KEYS.map(({ catKey, items }) => (
          <div key={catKey} className="concept-category">
            <h3 className="concept-cat-title">{t(catKey)}</h3>
            <ul className="concept-list">
              {items.map((item) => (
                <li key={item} className="concept-item">✓ {item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}
