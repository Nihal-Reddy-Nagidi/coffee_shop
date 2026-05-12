import { useEffect, useState } from 'react'
import heroImg from './assets/hero.png'
import './App.css'

const API_BASE = 'http://127.0.0.1:8000'

function App() {
  const [coffees, setCoffees] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [newCoffee, setNewCoffee] = useState({ name: '', description: '', price: '' })
  const [updatedPrices, setUpdatedPrices] = useState({})

  useEffect(() => {
    fetchCoffees()
  }, [])

  async function fetchCoffees() {
    setLoading(true)
    setError('')

    try {
      const response = await fetch(`${API_BASE}/coffees`)
      if (!response.ok) throw new Error('Could not load coffees.')
      const data = await response.json()
      setCoffees(data)
    } catch (err) {
      setError(err.message || 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  async function createCoffee(event) {
    event.preventDefault()
    setError('')

    const price = Number(newCoffee.price)
    if (!newCoffee.name || Number.isNaN(price)) {
      setError('Please enter a valid coffee name and price.')
      return
    }

    try {
      const response = await fetch(`${API_BASE}/coffees`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newCoffee.name,
          description: newCoffee.description,
          price,
        }),
      })

      if (!response.ok) throw new Error('Could not create coffee.')
      const created = await response.json()
      setCoffees((current) => [...current, created])
      setNewCoffee({ name: '', description: '', price: '' })
    } catch (err) {
      setError(err.message || 'Unable to create coffee.')
    }
  }

  async function updateCoffee(id) {
    setError('')
    const priceValue = updatedPrices[id]
    const price = Number(priceValue)
    if (Number.isNaN(price)) {
      setError('Enter a valid price to update.')
      return
    }

    try {
      const response = await fetch(`${API_BASE}/coffees/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ price }),
      })

      if (!response.ok) throw new Error('Could not update price.')
      const updated = await response.json()
      setCoffees((current) => current.map((coffee) => (coffee.id === id ? updated : coffee)))
    } catch (err) {
      setError(err.message || 'Unable to update coffee.')
    }
  }

  async function deleteCoffee(id) {
    setError('')
    try {
      const response = await fetch(`${API_BASE}/coffees/${id}`, { method: 'DELETE' })
      if (!response.ok) throw new Error('Could not delete coffee.')
      setCoffees((current) => current.filter((coffee) => coffee.id !== id))
    } catch (err) {
      setError(err.message || 'Unable to delete coffee.')
    }
  }

  return (
    <div className="App">
      <div className="emoji-stickers">
        <span className="emoji-sticker emoji-1">🫖</span>
        <span className="emoji-sticker emoji-2">🍵</span>
        <span className="emoji-sticker emoji-3">🧋</span>
        <span className="emoji-sticker emoji-4">☕</span>
        <span className="emoji-sticker emoji-5">🥐</span>
        <span className="emoji-sticker emoji-6">🍞</span>
        <span className="emoji-sticker emoji-7">🥨</span>
        <span className="emoji-sticker emoji-8">🥯</span>
      </div>
      <div className="page-shell">
        <header className="hero-section">
          <div className="hero-copy">
            <span className="eyebrow">Coffee Shop Dashboard</span>
            <h1>Serve the perfect brew with a beautiful aroma.</h1>
            <p>
              Enjoy the fragrance and the flavor of your coffee menu, all while managing it with ease. 
            </p>
            <div className="hero-badges">
              {/* <div>FastAPI backend</div>
              <div>React frontend</div>
              <div>Live CRUD</div> */}
            </div>
          </div>
          {/* <div className="hero-image-wrap">
            <img src={heroImg} alt="Coffee hero" className="hero-image" />
          </div> */}
        </header>

        <main>
          <section className="panel coffee-collection">
            <div className="section-head">
              <div>
                <h2>Available Coffees</h2>
                <p>Browse your coffee menu and update prices on the fly.</p>
              </div>
              {/* <span className="api-badge">API: {API_BASE}</span> */}
            </div>

            {error && <div className="alert">{error}</div>}
            {loading ? (
              <div className="loading">Loading coffees…</div>
            ) : coffees.length === 0 ? (
              <div className="empty-state">No coffee items available yet.</div>
            ) : (
              <div className="coffee-list">
                {coffees.map((coffee) => (
                  <article key={coffee.id} className="coffee-card">
                    <div className="coffee-badge">Bean #{coffee.id}</div>
                    <h3>{coffee.name}</h3>
                    <p>{coffee.description || 'Rich aroma, fresh grind, and smooth finish.'}</p>
                    <div className="coffee-actions">
                      <div className="coffee-price">${coffee.price.toFixed(2)}</div>
                      <div className="coffee-buttons">
                        <button className="ghost" onClick={() => deleteCoffee(coffee.id)}>
                          Delete
                        </button>
                      </div>
                    </div>
                    <div className="coffee-update-row">
                      <input
                        type="number"
                        step="0.01"
                        placeholder="New price"
                        value={updatedPrices[coffee.id] ?? ''}
                        onChange={(event) =>
                          setUpdatedPrices((prev) => ({ ...prev, [coffee.id]: event.target.value }))
                        }
                      />
                      <button onClick={() => updateCoffee(coffee.id)}>Update price</button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>

          <section className="panel coffee-form-panel">
            <div className="section-head">
              <div>
                <h2>Add a new coffee</h2>
                <p>Create a fresh menu item and watch it appear instantly.</p>
              </div>
            </div>

            <form className="coffee-form" onSubmit={createCoffee}>
              <label>
                <span>Name</span>
                <input
                  value={newCoffee.name}
                  onChange={(event) => setNewCoffee({ ...newCoffee, name: event.target.value })}
                  placeholder="Ethiopian Espresso"
                />
              </label>
              <label>
                <span>Description</span>
                <input
                  value={newCoffee.description}
                  onChange={(event) => setNewCoffee({ ...newCoffee, description: event.target.value })}
                  placeholder="Smooth, chocolate notes"
                />
              </label>
              <label>
                <span>Price</span>
                <input
                  value={newCoffee.price}
                  onChange={(event) => setNewCoffee({ ...newCoffee, price: event.target.value })}
                  placeholder="5.50"
                  type="number"
                  step="0.01"
                />
              </label>
              <button className="primary" type="submit">
                Add Coffee
              </button>
            </form>
          </section>
        </main>
      </div>
    </div>
  )
}

export default App
