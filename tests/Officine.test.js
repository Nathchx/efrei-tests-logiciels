const Officine = require("../src/Officine");

describe("Officine", () => {
  let officine;

  beforeEach(() => {
    officine = new Officine();
  });

  describe("rentrer", () => {
    test("devrait ajouter des ingrédients au stock", () => {
      officine.rentrer("3 yeux de grenouille");
      expect(officine.quantite("œil de grenouille")).toBe(3);
    });

    test("devrait gérer les variations de noms (pluriel/singulier)", () => {
      officine.rentrer("5 larmes de brume funèbre");
      expect(officine.quantite("larme de brume funèbre")).toBe(5);
    });

    test("devrait accumuler les quantités", () => {
      officine.rentrer("3 yeux de grenouille");
      officine.rentrer("2 œil de grenouille");
      expect(officine.quantite("œil de grenouille")).toBe(5);
    });

    test("devrait lever une erreur pour un ingrédient inconnu", () => {
      expect(() => {
        officine.rentrer("5 ingrédient inexistant");
      }).toThrow("Ingrédient inconnu");
    });

    test("devrait lever une erreur pour un format invalide", () => {
      expect(() => {
        officine.rentrer("yeux de grenouille sans quantité");
      }).toThrow("Format invalide");
    });
    test("devrait empêcher l'ajout de quantités négatives", () => {
      expect(() => {
        officine.rentrer("-5 yeux de grenouille");
      }).toThrow("Format invalide");
    });

    test("devrait empêcher l'ajout de quantité zéro", () => {
      expect(() => {
        officine.rentrer("0 yeux de grenouille");
      }).toThrow("Format invalide");
    });

    test("devrait accepter seulement les nombres entiers positifs", () => {
      expect(() => {
        officine.rentrer("1 yeux de grenouille");
        officine.rentrer("999 larmes de brume funèbre");
      }).not.toThrow();

      expect(officine.quantite("œil de grenouille")).toBe(1);
      expect(officine.quantite("larme de brume funèbre")).toBe(999);
    });

    test("devrait empêcher les formats avec des décimales", () => {
      expect(() => {
        officine.rentrer("2.5 yeux de grenouille");
      }).toThrow("Format invalide");
    });

    test("devrait empêcher les nombres avec des signes plus", () => {
      expect(() => {
        officine.rentrer("+5 yeux de grenouille");
      }).toThrow("Format invalide");
    });

    test("devrait empêcher les textes sans nombres", () => {
      expect(() => {
        officine.rentrer("beaucoup de yeux de grenouille");
      }).toThrow("Format invalide");
    });

    test("devrait empêcher les quantités écrites en lettres", () => {
      expect(() => {
        officine.rentrer("deux larmes de brume funèbre");
      }).toThrow("Format invalide");

      expect(() => {
        officine.rentrer("trois yeux de grenouille");
      }).toThrow("Format invalide");

      expect(() => {
        officine.rentrer("cinq pincées de poudre de lune");
      }).toThrow("Format invalide");

      expect(() => {
        officine.rentrer("dix gouttes de sang de citrouille");
      }).toThrow("Format invalide");
    });

    test("devrait empêcher les mélanges chiffres et lettres", () => {
      expect(() => {
        officine.rentrer("2 deux yeux de grenouille");
      }).toThrow("Ingrédient inconnu");

      expect(() => {
        officine.rentrer("trois 3 larmes de brume funèbre");
      }).toThrow("Format invalide");
    });

    test("devrait empêcher les espaces avant les chiffres", () => {
      expect(() => {
        officine.rentrer(" 5 yeux de grenouille");
      }).toThrow("Format invalide");
    });
  });

  describe("quantite", () => {
    test("devrait retourner 0 pour un ingrédient non ajouté", () => {
      expect(officine.quantite("œil de grenouille")).toBe(0);
    });

    test("devrait retourner la quantité correcte après ajout", () => {
      officine.rentrer("7 pincées de poudre de lune");
      expect(officine.quantite("pincée de poudre de lune")).toBe(7);
    });

    test("devrait gérer les variations de noms", () => {
      officine.rentrer("4 crocs de troll");
      expect(officine.quantite("croc de troll")).toBe(4);
      expect(officine.quantite("crocs de troll")).toBe(4);
    });

    test("devrait lever une erreur pour un ingrédient inexistant", () => {
      expect(() => {
        officine.quantite("ingrédient inexistant");
      }).toThrow("Ingrédient/Potion inconnu");
    });
  });

  describe("preparer", () => {
    beforeEach(() => {
      officine.rentrer("10 larmes de brume funèbre");
      officine.rentrer("5 gouttes de sang de citrouille");
      officine.rentrer("15 pincées de poudre de lune");
      officine.rentrer("5 yeux de grenouille");
      officine.rentrer("8 crocs de troll");
      officine.rentrer("4 fragments d'écaille de dragonnet");
      officine.rentrer("10 radicelles de racine hurlante");
    });

    test("devrait préparer des fioles de glaires purulentes", () => {
      const resultat = officine.preparer("2 fioles de glaires purulentes");
      expect(resultat).toBe(2);

      expect(officine.quantite("larme de brume funèbre")).toBe(6);
      expect(officine.quantite("goutte de sang de citrouille")).toBe(3);

      expect(officine.quantite("fiole de glaires purulentes")).toBe(2);
    });

    test("devrait préparer des billes d'âme évanescente", () => {
      const resultat = officine.preparer("3 billes d'âme évanescente");
      expect(resultat).toBe(3);

      expect(officine.quantite("pincée de poudre de lune")).toBe(6);
      expect(officine.quantite("œil de grenouille")).toBe(2);
      expect(officine.quantite("bille d'âme évanescente")).toBe(3);
    });

    test("devrait limiter la préparation selon les ingrédients disponibles", () => {
      const resultat = officine.preparer("10 fioles de glaires purulentes");
      expect(resultat).toBe(5);
    });

    test("devrait retourner 0 si pas assez d'ingrédients", () => {
      officine.stocks["goutte de sang de citrouille"] = 0;

      const resultat = officine.preparer("1 fiole de glaires purulentes");
      expect(resultat).toBe(0);
    });

    test("devrait lever une erreur pour une recette inconnue", () => {
      expect(() => {
        officine.preparer("1 potion inexistante");
      }).toThrow("Recette inconnue");
    });

    test("devrait préparer des potions complexes (soupçon de sels suffocants)", () => {
      const resultat = officine.preparer("2 soupçons de sels suffocants");
      expect(resultat).toBe(2);

      expect(officine.quantite("croc de troll")).toBe(4);
      expect(officine.quantite("fragment d'écaille de dragonnet")).toBe(2);
      expect(officine.quantite("radicelle de racine hurlante")).toBe(8);
      expect(officine.quantite("soupçon de sels suffocants")).toBe(2);
    });

    test("devrait gérer les recettes avec des potions comme ingrédients", () => {
      officine.preparer("3 fioles de glaires purulentes");

      const resultat = officine.preparer("1 baton de pâte sépulcrale");
      expect(resultat).toBe(1);

      expect(officine.quantite("radicelle de racine hurlante")).toBe(7);
      expect(officine.quantite("fiole de glaires purulentes")).toBe(2);
      expect(officine.quantite("baton de pâte sépulcrale")).toBe(1);
    });

    test("devrait gérer plusieurs préparations successives de baton de pâte sépulcrale", () => {
      officine.preparer("5 fioles de glaires purulentes");
      expect(officine.quantite("fiole de glaires purulentes")).toBe(5);
      expect(officine.quantite("radicelle de racine hurlante")).toBe(10);

      let resultat = officine.preparer("1 baton de pâte sépulcrale");
      expect(resultat).toBe(1);
      expect(officine.quantite("radicelle de racine hurlante")).toBe(7);
      expect(officine.quantite("fiole de glaires purulentes")).toBe(4);
      expect(officine.quantite("baton de pâte sépulcrale")).toBe(1);

      resultat = officine.preparer("1 baton de pâte sépulcrale");
      expect(resultat).toBe(1);
      expect(officine.quantite("radicelle de racine hurlante")).toBe(4);
      expect(officine.quantite("fiole de glaires purulentes")).toBe(3);
      expect(officine.quantite("baton de pâte sépulcrale")).toBe(2);

      resultat = officine.preparer("2 batons de pâte sépulcrale");
      expect(resultat).toBe(1);
      expect(officine.quantite("radicelle de racine hurlante")).toBe(1);
      expect(officine.quantite("fiole de glaires purulentes")).toBe(2);
      expect(officine.quantite("baton de pâte sépulcrale")).toBe(3);
    });
  });

  describe("preparer - Tests des stocks avec conditions spécifiques", () => {
    let officineIsolee;

    beforeEach(() => {
      officineIsolee = new Officine();
    });

    test("devrait empêcher les stocks négatifs lors de préparations multiples", () => {
      officineIsolee.rentrer("2 larmes de brume funèbre");
      officineIsolee.rentrer("1 goutte de sang de citrouille");

      let resultat = officineIsolee.preparer("1 fiole de glaires purulentes");
      expect(resultat).toBe(1);
      expect(officineIsolee.quantite("larme de brume funèbre")).toBe(0);
      expect(officineIsolee.quantite("goutte de sang de citrouille")).toBe(0);

      resultat = officineIsolee.preparer("1 fiole de glaires purulentes");
      expect(resultat).toBe(0);
      expect(officineIsolee.quantite("larme de brume funèbre")).toBe(0);
      expect(officineIsolee.quantite("goutte de sang de citrouille")).toBe(0);
    });

    test("ne devrait jamais avoir de stocks négatifs même avec des demandes importantes", () => {
      officineIsolee.rentrer("1 yeux de grenouille");
      officineIsolee.rentrer("1 pincée de poudre de lune");

      const resultat = officineIsolee.preparer("100 billes d'âme évanescente");
      expect(resultat).toBe(0);

      expect(officineIsolee.quantite("œil de grenouille")).toBe(1);
      expect(officineIsolee.quantite("pincée de poudre de lune")).toBe(1);
      expect(officineIsolee.quantite("bille d'âme évanescente")).toBe(0);
    });

    test("devrait gérer correctement les stocks partiellement suffisants", () => {
      officineIsolee.rentrer("7 pincées de poudre de lune");
      officineIsolee.rentrer("5 yeux de grenouille");

      const resultat = officineIsolee.preparer("5 billes d'âme évanescente");
      expect(resultat).toBe(2);

      expect(officineIsolee.quantite("pincée de poudre de lune")).toBe(1);
      expect(officineIsolee.quantite("œil de grenouille")).toBe(3);
      expect(officineIsolee.quantite("bille d'âme évanescente")).toBe(2);
    });
  });
});
