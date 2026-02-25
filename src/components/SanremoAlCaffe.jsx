import { useState } from 'react';
import { Coffee, Sparkles } from 'lucide-react';

const STATIC_REVIEWS = [
    "C’è qualcosa di profondamente malinconico nel veder trionfare la 'Magica favola' di Arisa mentre il Paese reale affoga nel pop di plastica. Brava, per carità, ma la vera scossa arriva da Fulminacci: uno dei pochi che sa ancora scrivere senza usare il manuale delle giovani marmotte. Fedez e Masini? Un’operazione simpatia che puzza di algoritmo lontano un miglio. Voto: 7 alla musica, 4 al coraggio.",
    "Che spettacolo, amici! Un’emozione pazzesca vedere Serena Brancale incendiare l’Ariston con quella voce che sembra venire dal paradiso del jazz. È stato un Festival di sorrisi, di bellezza e di canzoni che restano nel cuore. E Ditonellapiaga? Una ventata di freschezza divina! Un bacio grande a tutti, è stato tutto... favoloso!",
    "La liturgia contiana procede senza intoppi, tra una Pausini istituzionale e un Can Yaman messo lì come soprammobile di lusso. La musica? Un rumore di fondo. La classifica premia il già sentito: Arisa gioca a fare la fatina, Fedez cerca una redenzione catodica accanto a un Masini insolitamente rassegnato. La TV italiana è un eterno ritorno dell'uguale, un acquario dove i pesci cantano sempre la stessa bolla.",
    "Possiamo parlare di Fedez che per l’ennesima volta si presenta a Sanremo con la faccia di chi sta facendo un favore all’umanità? La coppia con Masini è il crossover che nessuno aveva chiesto, un po’ come l’ananas sulla pizza. Intanto Ditonellapiaga si mangia il palco con un’ironia che metà degli altri concorrenti non saprebbe nemmeno compitare. La classifica della sala stampa? Un mix di sensi di colpa e quote rosa ben gestite.",
    "Iniziamo con un dato di fatto: la maratona Sanremo 2026 parte con un colpo di scena. Brancale e Fulminacci scavalcano i big 'tradizionali' nelle preferenze dei giornalisti. C’è un tema di rinnovamento generazionale che non può essere ignorato. Arisa tiene la posizione, ma attenzione al voto del pubblico che potrebbe ribaltare tutto nelle prossime ore. Breve pausa, poi torniamo con i grafici.",
    "Buonasera. Qui a Sanremo abbiamo visto un’Italia che vuole cantare, ma anche un’Italia che riflette. La vittoria provvisoria di Arisa ci dice che il pubblico cerca rassicurazione. Ma la domanda che pongo ai miei ospiti è: la strana coppia Fedez-Masini rappresenta davvero il sentimento popolare di questo 2026? Un connubio curioso, quasi un governo di larghe intese della musica leggera.",
    "Il 'Metodo Conti' non delude: un po’ di democristianeria musicale e un pizzico di populismo radiofonico. Vedere Fedez in cima alla classifica dopo mesi di paginate sui social fa quasi sorridere: è il trasformismo elevato a nota musicale. Per fortuna c’è J-Ax che con 'Italia Starter Pack' fa quello che i giornalisti non hanno più il coraggio di fare: dirci quanto siamo ridicoli. Ma ovviamente i soliti noti preferiscono la 'favola' di Arisa.",
    "FLASH! L’Ariston è diventato una succursale di Tik Tok! La Brancale 'spettina' tutti con un pezzo che fa tremare le poltrone, mentre il povero Masini sembra chiedersi che fine abbia fatto la sua 'disperazione' tra i tatuaggi di Fedez. Ditonellapiaga è la vera regina della notte, acida quanto basta per non farci addormentare. E Conti? Sorride, s'abbronza e incassa lo share. Cafonal Ariston Edition!",
    "C'è un'eleganza sottile nel modo in cui Arisa abita il palco, una fragilità che diventa forza politica in un mondo di urla. Le donne di questo Festival, dalla Brancale alla Maria Antonietta, dimostrano che non serve il trucco pesante per farsi sentire. È un Sanremo che finalmente smette di chiedere scusa per la propria intelligenza, anche se la classifica deve ancora fare i conti con i vecchi fantasmi del maschilismo pop.",
    "Musicalmente la serata è stata una sorpresa. Serena Brancale ha portato una complessità armonica che mancava da anni, un jazz-pop di caratura internazionale. Fulminacci si conferma il miglior erede della scuola romana, con una scrittura asciutta e mai banale. La Top 5 riflette un buon equilibrio tra ricerca e melodia italiana, anche se la coppia Fedez-Masini appare più come un esperimento di laboratorio che come una reale urgenza artistica.",
    "Lo dico chiaramente: questa classifica è un insulto all'intelligenza. Mettere Fedez e Masini tra i primi cinque significa che abbiamo smesso di ascoltare le canzoni e guardiamo solo i follower. L'unica nota di merito è Ditonellapiaga, l'unica che ha capito che il pop deve essere frizione, non lubrificante. Il resto è noia mascherata da 'favola'. Mi troverete al bar dell'Ariston a bere per dimenticare.",
    "Mi ricorda il 1984, quando le giurie cercavano la novità ma finivano per premiare l'usato sicuro. Arisa ha la stoffa delle grandi dive di una volta, ma con quella punta di follia contemporanea. La Brancale è la vera rivelazione: ha una tecnica che farebbe impallidire i veterani. Fedez? Un ragazzo intelligente, ma Masini è un'altra categoria vocale. Speriamo che il duetto non diventi un duello.",
    "Un Festival molto italiano, ma con un occhio all'Europa. Fulminacci è il genere di artista che ci fa sentire moderni senza sforzo. La Top 5 è come una buona lista della spesa: c'è l'ingrediente classico (Arisa), quello esotico (Brancale) e quello che compri solo per curiosità (Fedez & Masini). Un'organizzazione impeccabile, forse fin troppo: ogni tanto la perfezione annoia quanto un tè senza limone.",
    "C’è un filo invisibile che lega le canzoni di questa sera: la ricerca di un posto nel mondo. Arisa lo trova in una favola, Ditonellapiaga in un fastidio che diventa identità. Mi ha colpito la voce di Serena Brancale, una voce che non chiede permesso ma si prende tutto lo spazio dell'anima. È un Sanremo che somiglia a un diario intimo, scritto a più mani, in una notte di febbraio che profuma di futuro.",
    "Ma cos'è questa classifica? Capre! Capre musicali! Serena Brancale è l'unica che ha un senso estetico, una struttura, un'architettura sonora! Il resto è melma, è fango, è la morte dell'arte! Fedez e Masini? Un ossimoro vivente, un insulto alla dignità della melodia! Ditonellapiaga? Almeno ha un nome che evoca una punizione divina per chi ascolta queste lagne! Studiate la musica, ignoranti!",
    "Pezzi che spaccheranno in radio, garantito! Fulminacci ha un ritornello che non ti esce più dalla testa, perfetto per l'heavy rotation. Arisa torna a fare l'Arisa e la sala stampa la premia giustamente. La coppia Fedez-Masini è il 'power play' della stagione: piacerà a tutte le età. Un Festival che gira veloce, con un ritmo pazzesco. Franremo dice che sono i favoriti e io non posso che confermare!",
    "Niente fronzoli: Arisa canta meglio di tutti e lo sa. Fulminacci scrive meglio di tutti e lo sa. La Brancale è una spanna sopra tecnicamente. Questa Top 5 è onesta, premia chi sa stare sul palco senza aver bisogno di troppi effetti speciali. Sorpresa Ditonellapiaga: cattiva, ritmata, centrata. Un Festival meno 'monocorde' del solito, grazie al cielo.",
    "Dobbiamo chiederci cosa c'è dietro il posizionamento di certi nomi. La scalata di Fedez e Masini puzza di strategia discografica massiccia, un tentativo di blindare il podio fin dalla prima sera. Ma la sala stampa ha dato un segnale forte premiando la Brancale e Fulminacci: la qualità indipendente può ancora bucare lo schermo. Terremo gli occhi aperti sulle prossime votazioni.",
    "È stata una notte di fantasmi e di rinascite. Masini che presta il suo dolore alla rabbia social di Fedez è un romanzo di formazione mancato. Ma la musica vera è passata tra le dita di Fulminacci, in quel suo modo di raccontare la 'stupida sfortuna' di essere vivi oggi. Arisa è un monumento che respira, una creatura che appartiene a un altro tempo, mentre la Brancale ci ricorda che il ritmo è l'unica rivoluzione possibile.",
    "Ehilà amici! Che serata incredibile a Sanremo! Ho visto tante belle canzoni e dei giovani bravissimi come Fulminacci e Serena Brancale. Arisa poi ha una voce magica, davvero! E che dire di Fedez e Marco Masini? Un'accoppiata simpatica! Mi sono divertito molto a seguire tutto con voi. Un grande abbraccio a tutti! State bene? Fatemi sapere!"
];

export default function SanremoAlCaffe() {
    const [summary, setSummary] = useState('');
    const [loading, setLoading] = useState(false);

    const generateSummary = () => {
        setLoading(true);
        setSummary('');

        // Simulate a tiny bit of loading time for effect
        setTimeout(() => {
            const randomIndex = Math.floor(Math.random() * STATIC_REVIEWS.length);
            setSummary(STATIC_REVIEWS[randomIndex]);
            setLoading(false);
        }, 800);
    };

    return (
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 mb-8 text-center relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 blur-xl group-hover:blur-2xl transition-all pointer-events-none">
                <Coffee size={120} className="text-primary-gold" />
            </div>

            <div className="relative z-10">
                <h2 className="text-2xl font-black text-primary-gold mb-3 flex items-center justify-center gap-2">
                    <Coffee className="text-white" size={24} /> Sanremo al caffè
                </h2>
                <p className="text-white/80 mb-6 font-medium">
                    Non sai cosa dire su Sanremo in ufficio? clicca qui per un sintesi personalizzata
                </p>

                {!summary && !loading && (
                    <button
                        onClick={generateSummary}
                        className="bg-primary-gold text-bg-dark px-8 py-3 rounded-full font-bold hover:scale-105 transition-transform flex items-center gap-2 mx-auto"
                    >
                        <Sparkles size={18} /> Escila
                    </button>
                )}

                {loading && (
                    <div className="text-primary-gold animate-pulse flex flex-col items-center gap-2 py-4">
                        <Coffee className="animate-bounce" size={24} />
                        <span className="font-semibold">Macinando recensioni...</span>
                    </div>
                )}

                {summary && !loading && (
                    <div className="mt-6 bg-bg-dark/50 border border-primary-gold/30 rounded-2xl p-6 text-left">
                        <p className="text-white/90 text-lg md:text-xl leading-relaxed font-serif italic mb-4">
                            "{summary}"
                        </p>
                        <div className="flex justify-center mt-6">
                            <button
                                onClick={generateSummary}
                                className="text-sm text-primary-gold hover:text-white transition-colors underline decoration-primary-gold/50 underline-offset-4"
                            >
                                Un altro giro?
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
