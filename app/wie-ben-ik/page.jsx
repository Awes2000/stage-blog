import { redirect } from 'next/navigation'
import { getUserFromCookie } from '@/lib/auth'
import Navbar from '@/components/Navbar'

export default async function WieBenIkPage() {
  const user = await getUserFromCookie()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">Wie ben ik?</h1>

          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Over mijzelf</h2>
              <p className="text-gray-700 leading-relaxed">
                Mijn naam is Awes Zoretic en ik ben student aan het Mediacollege Amsterdam.
                Ik ben gepassioneerd over webontwikkeling en technologie, en deze stage blog
                is een onderdeel van mijn leerproces tijdens mijn stage.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Waarom deze opleiding?
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Ik heb gekozen voor deze opleiding omdat ik altijd al geïnteresseerd ben geweest
                in het creëren van digitale oplossingen. De combinatie van creativiteit en
                technische vaardigheden spreekt me enorm aan. Webontwikkeling biedt eindeloze
                mogelijkheden om ideeën tot leven te brengen en problemen op te lossen.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Wat weet ik er al van?
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Voor mijn stage had ik al kennis van verschillende technologieën en concepten:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Basis HTML, CSS en JavaScript</li>
                <li>Fundamenten van webdesign en user experience</li>
                <li>Git en versiebeheer</li>
                <li>Interesse in moderne frameworks zoals React en Next.js</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-4">
                Tijdens mijn stage wil ik deze kennis verder uitbreiden en toepassen in
                echte projecten.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Mijn sterke kanten
              </h2>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li><strong>Leergierigheid:</strong> Ik ben altijd bereid om nieuwe dingen te leren en uit mijn comfortzone te stappen</li>
                <li><strong>Probleemoplossend vermogen:</strong> Ik vind het leuk om uitdagingen aan te gaan en creatieve oplossingen te vinden</li>
                <li><strong>Zelfstandigheid:</strong> Ik kan goed zelfstandig werken en initiatief nemen</li>
                <li><strong>Nauwkeurigheid:</strong> Ik let op details en streef naar kwaliteit in mijn werk</li>
                <li><strong>Nieuwsgierigheid:</strong> Ik ben altijd op zoek naar nieuwe technologieën en best practices</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Mijn zwakke kanten
              </h2>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li><strong>Perfectionisme:</strong> Soms besteed ik te veel tijd aan kleine details terwijl de grote lijnen belangrijker zijn</li>
                <li><strong>Communicatie:</strong> Ik moet nog werken aan het beter communiceren van problemen en vragen stellen wanneer ik vastloop</li>
                <li><strong>Timemanagement:</strong> Ik kan soms te ambitieus zijn met hoeveel ik in korte tijd wil bereiken</li>
                <li><strong>Ervaring:</strong> Sommige professionele tools en workflows zijn nog nieuw voor mij</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-4">
                Door deze zwakke punten te erkennen, kan ik eraan werken en groeien tijdens
                mijn stage.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Mijn doelen voor deze stage
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Tijdens mijn stage wil ik:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Praktische ervaring opdoen met professionele webontwikkeling</li>
                <li>Leren werken in een team en bedrijfsomgeving</li>
                <li>Mijn technische vaardigheden verder ontwikkelen</li>
                <li>Feedback krijgen en gebruiken om mezelf te verbeteren</li>
                <li>Een portfolio opbouwen van projecten waar ik trots op ben</li>
              </ul>
            </section>
          </div>

          {user.role === 'admin' && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                💡 Admin: Je kunt deze pagina aanpassen door het bestand te bewerken in <code className="bg-gray-100 px-2 py-1 rounded">app/wie-ben-ik/page.jsx</code>
              </p>
            </div>
          )}
        </div>

        <div className="mt-6">
          <a
            href="/posts"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            ← Terug naar posts
          </a>
        </div>
      </div>
    </div>
  )
}
