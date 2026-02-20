export const initialArtists = [
    "Arisa", "Bambole di pezza", "Chiello", "Dargen D’Amico", "Ditonellapiaga",
    "Eddie Brock", "Elettra Lamborghini", "Enrico Nigiotti", "Ermal Meta",
    "Fedez & Masini", "Francesco Renga", "Fulminacci", "J-Ax", "LDA & Aka 7even",
    "Leo Gassmann", "Levante", "Luchè", "Malika Ayane", "Mara Sattei",
    "Maria Antonietta & Colombre", "Michele Bravi", "Nayt", "Patty Pravo",
    "Raf", "Sal Da Vinci", "Samurai Jay", "Sayf", "Serena Brancale",
    "Tommaso Paradiso", "Tredici Pietro"
].map((name, index) => ({
    id: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
    nome: name,
    canzone: "Titolo Canzone", // Placeholder
    recensione_admin: "",
    voto_admin: 0,
    parola_chiave: "",
    is_published: false,
    published_at: null,
    user_votes: [],
    is_test: false
}));

// Add test artist
initialArtists.push({
    id: "peppe-vessicchio",
    nome: "Peppe Vessicchio",
    canzone: "Canzone di Prova",
    recensione_admin: "Un maestro senza tempo",
    voto_admin: 10,
    parola_chiave: "Dirimpettaio",
    is_published: true,
    published_at: new Date(),
    user_votes: [],
    is_test: true
});
