import { View, Text, FlatList, StyleSheet } from 'react-native';

type Evenement = {
  id: string;
  titre: string;
  categorie: string;
  capacite: number;
  inscrits: number;
};

const evenements: Evenement[] = [
  { id: 'E01', titre: 'Atelier React', categorie: 'Atelier', capacite: 25, inscrits: 25 },
  { id: 'E02', titre: 'Conférence IA', categorie: 'Conférence', capacite: 70, inscrits: 52 },
  { id: 'E03', titre: 'Sécurité mobile', categorie: 'Atelier', capacite: 20, inscrits: 17 },
  { id: 'E04', titre: 'Design UI', categorie: 'Atelier', capacite: 18, inscrits: 9 },
  { id: 'E05', titre: 'Forum projets', categorie: 'Rencontre', capacite: 50, inscrits: 49 },
  { id: 'E06', titre: 'Découverte Git', categorie: 'Atelier', capacite: 24, inscrits: 24 },
];

// 'tous' ou 'ateliers'
const mode: string = 'ateliers';

function placesRestantes(e: Evenement) {
  const r = e.capacite - e.inscrits;
  if (r < 0) {
    return 0;
  }
  return r;
}

function statutEvenement(e: Evenement) {
  const r = placesRestantes(e);
  if (r === 0) {
    return 'Complet';
  } else if (r <= 3) {
    return 'Presque complet';
  } else {
    return 'Ouvert';
  }
}

// calculs
const total = evenements.length;
const complets = evenements.filter((e) => placesRestantes(e) === 0).length;
const avecPlaces = evenements.filter((e) => placesRestantes(e) > 0).length;
const sommePlaces = evenements.reduce((s, e) => s + placesRestantes(e), 0);

const ateliers = evenements.filter(
  (e) => e.categorie === 'Atelier' && placesRestantes(e) > 0
);

// données selon le mode
let donnees = evenements;
let titreListe = 'Tous les événements';
if (mode === 'ateliers') {
  donnees = ateliers;
  titreListe = 'Ateliers disponibles';
}

// composants
type BadgeProps = { statut: string };

function BadgeEtat({ statut }: BadgeProps) {
  let fond = '#d4f5dd';
  if (statut === 'Complet') {
    fond = '#fbd5d5';
  } else if (statut === 'Presque complet') {
    fond = '#fde5c8';
  }
  return (
    <View style={[styles.badge, { backgroundColor: fond }]}>
      <Text style={styles.badgeTexte}>{statut}</Text>
    </View>
  );
}

type CarteProps = {
  titre: string;
  categorie: string;
  places: number;
  statut: string;
};

function CarteEvenement({ titre, categorie, places, statut }: CarteProps) {
  return (
    <View style={styles.carte}>
      <View style={styles.infos}>
        <Text style={styles.titre}>{titre}</Text>
        <Text style={styles.categorie}>{categorie}</Text>
        <Text>{places} place(s) restante(s)</Text>
      </View>
      <BadgeEtat statut={statut} />
    </View>
  );
}

type BlocProps = { libelle: string; valeur: number };

function BlocStatistique({ libelle, valeur }: BlocProps) {
  return (
    <View style={styles.bloc}>
      <Text style={styles.valeur}>{valeur}</Text>
      <Text>{libelle}</Text>
    </View>
  );
}

export default function App() {
  return (
    <View style={styles.ecran}>
      <View style={styles.entete}>
        <Text style={styles.enteteTitre}>CampusAgenda</Text>
        <Text style={styles.enteteSousTitre}>Événements du campus</Text>
      </View>

      <View style={styles.stats}>
        <BlocStatistique libelle="Événements" valeur={total} />
        <BlocStatistique libelle="Complets" valeur={complets} />
        <BlocStatistique libelle="Avec places" valeur={avecPlaces} />
        <BlocStatistique libelle="Places restantes" valeur={sommePlaces} />
      </View>

      <Text style={styles.titreListe}>{titreListe}</Text>

      <FlatList
        data={donnees}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CarteEvenement
            titre={item.titre}
            categorie={item.categorie}
            places={placesRestantes(item)}
            statut={statutEvenement(item)}
          />
        )}
        ListEmptyComponent={<Text style={styles.vide}>Aucun événement à afficher.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  ecran: {
    flex: 1,
    backgroundColor: '#f2f5fa',
    padding: 16,
    paddingTop: 50,
  },
  entete: {
    backgroundColor: '#0b3a91',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  enteteTitre: { color: 'white', fontSize: 22, fontWeight: 'bold' },
  enteteSousTitre: { color: '#cfdcf5' },

  stats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  bloc: {
    width: '48%',
    backgroundColor: '#e3ebfa',
    borderRadius: 10,
    padding: 10,
    marginBottom: 8,
    alignItems: 'center',
  },
  valeur: { fontSize: 22, fontWeight: 'bold', color: '#0b3a91' },

  titreListe: { fontSize: 18, fontWeight: 'bold', marginVertical: 8 },

  carte: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
  },
  infos: { flex: 1, marginRight: 8 },
  titre: { fontSize: 16, fontWeight: 'bold' },
  categorie: { color: 'gray' },

  badge: { paddingVertical: 4, paddingHorizontal: 10, borderRadius: 20 },
  badgeTexte: { fontWeight: 'bold', fontSize: 12 },

  vide: { textAlign: 'center', marginTop: 30, color: 'gray' },
});