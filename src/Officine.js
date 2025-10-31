class Officine {
  constructor() {
    this.ingredients = [
      "œil/yeux de grenouille",
      "larme de brume funèbre",
      "radicelle de racine hurlante",
      "pincée de poudre de lune",
      "croc de troll",
      "fragment d'écaille de dragonnet",
      "goutte de sang de citrouille",
    ];

    this.recettes = {
      "fiole de glaires purulentes": [
        "2 larmes de brume funèbre",
        "1 goutte de sang de citrouille",
      ],
      "bille d'âme évanescente": [
        "3 pincées de poudre de lune",
        "1 œil de grenouille",
      ],
      "soupçon de sels suffocants": [
        "2 crocs de troll",
        "1 fragment d'écaille de dragonnet",
        "1 radicelle de racine hurlante",
      ],
      "baton de pâte sépulcrale": [
        "3 radicelles de racine hurlante",
        "1 fiole de glaires purulentes",
      ],
      "bouffée d'essence de cauchemar": [
        "2 pincées de poudre de lune",
        "2 larmes de brume funèbre",
      ],
    };

    this.stocks = {};

    this.ingredients.forEach((ingredient) => {
      const nomNormalise = this._normaliserNom(ingredient);
      this.stocks[nomNormalise] = 0;
    });

    Object.keys(this.recettes).forEach((potion) => {
      this.stocks[this._normaliserNom(potion)] = 0;
    });
  }

  /**
   * Normalise le nom d'un ingrédient/potion pour gérer les variations
   */
  _normaliserNom(nom) {
    const nomNettoye = nom.toLowerCase().trim();

    const normalisation = {
      "œil/yeux de grenouille": "œil de grenouille",
      "yeux de grenouille": "œil de grenouille",
      "œil de grenouille": "œil de grenouille",
      "larmes de brume funèbre": "larme de brume funèbre",
      "larme de brume funèbre": "larme de brume funèbre",
      "radicelles de racine hurlante": "radicelle de racine hurlante",
      "radicelle de racine hurlante": "radicelle de racine hurlante",
      "pincées de poudre de lune": "pincée de poudre de lune",
      "pincée de poudre de lune": "pincée de poudre de lune",
      "crocs de troll": "croc de troll",
      "croc de troll": "croc de troll",
      "fragments d'écaille de dragonnet": "fragment d'écaille de dragonnet",
      "fragment d'écaille de dragonnet": "fragment d'écaille de dragonnet",
      "gouttes de sang de citrouille": "goutte de sang de citrouille",
      "goutte de sang de citrouille": "goutte de sang de citrouille",
      // Potions
      "fioles de glaires purulentes": "fiole de glaires purulentes",
      "fiole de glaires purulentes": "fiole de glaires purulentes",
      "billes d'âme évanescente": "bille d'âme évanescente",
      "bille d'âme évanescente": "bille d'âme évanescente",
      "soupçons de sels suffocants": "soupçon de sels suffocants",
      "soupçon de sels suffocants": "soupçon de sels suffocants",
      "batons de pâte sépulcrale": "baton de pâte sépulcrale",
      "baton de pâte sépulcrale": "baton de pâte sépulcrale",
      "bouffées d'essence de cauchemar": "bouffée d'essence de cauchemar",
      "bouffée d'essence de cauchemar": "bouffée d'essence de cauchemar",
    };

    return normalisation[nomNettoye] || nomNettoye;
  }

  /**
   * Parse une chaîne comme "3 yeux de grenouille" pour extraire la quantité et le nom
   */
  _parserQuantiteEtNom(chaine) {
    const match = chaine.match(/^(\d+)\s+(.+)$/);
    if (!match) {
      throw new Error(`Format invalide: ${chaine}`);
    }

    const quantite = parseInt(match[1]);
    if (quantite <= 0) {
      throw new Error(`Format invalide: ${chaine}`);
    }

    return {
      quantite: quantite,
      nom: this._normaliserNom(match[2]),
    };
  }

  rentrer(entree) {
    const { quantite, nom } = this._parserQuantiteEtNom(entree);

    if (this.stocks.hasOwnProperty(nom)) {
      this.stocks[nom] += quantite;
    } else {
      throw new Error(`Ingrédient inconnu: ${nom}`);
    }
  }

  quantite(nom) {
    const nomNormalise = this._normaliserNom(nom);
    if (this.stocks.hasOwnProperty(nomNormalise)) {
      return this.stocks[nomNormalise];
    } else {
      throw new Error(`Ingrédient/Potion inconnu: ${nom}`);
    }
  }

  preparer(demande) {
    const { quantite: quantiteDemandee, nom: nomPotion } =
      this._parserQuantiteEtNom(demande);

    if (!this.recettes.hasOwnProperty(nomPotion)) {
      throw new Error(`Recette inconnue: ${nomPotion}`);
    }

    const recette = this.recettes[nomPotion];

    let maxPotionsPossibles = Infinity;

    for (const ingredient of recette) {
      const { quantite: quantiteNecessaire, nom: nomIngredient } =
        this._parserQuantiteEtNom(ingredient);
      const stockDisponible = this.quantite(nomIngredient);
      const potionsPossiblesAvecCetIngredient = Math.floor(
        stockDisponible / quantiteNecessaire
      );
      maxPotionsPossibles = Math.min(
        maxPotionsPossibles,
        potionsPossiblesAvecCetIngredient
      );
    }

    const potionsAPreparrer = Math.min(quantiteDemandee, maxPotionsPossibles);

    if (potionsAPreparrer > 0) {
      for (const ingredient of recette) {
        const { quantite: quantiteNecessaire, nom: nomIngredient } =
          this._parserQuantiteEtNom(ingredient);
        this.stocks[nomIngredient] -= quantiteNecessaire * potionsAPreparrer;
      }

      this.stocks[nomPotion] += potionsAPreparrer;
    }

    return potionsAPreparrer;
  }
}

module.exports = Officine;
