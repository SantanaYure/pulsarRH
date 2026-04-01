import styles from './App.module.css'
import { Logo } from './components/Logo'
import { MessageGeneratorSection } from './components/MessageGeneratorSection'

const LOGO_URL =
  'https://res.cloudinary.com/dbfalryaz/image/upload/v1775067613/Pulsar_RH_wvujnw.png'

function App() {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.brand}>
          <Logo src={LOGO_URL} size={288} alt="Logo da Pulsar RH" />
          <h1 className={styles.title}>Pulsar RH</h1>
        </div>
      </section>

      <MessageGeneratorSection />
    </main>
  )
}

export default App
