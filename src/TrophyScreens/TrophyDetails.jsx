import { useParams } from "react-router-dom";
import { useState } from "react";
import "./TrophyDetails.css";

// Lista estática dos troféus por jogo
const TROPHIES = {
  "hollow-knight": [
    { name: "Coração de Hallownest", description: "Adquira todos os outros troféus" },
    { name: "Falsidade", description: "Derrote o Falso Cavaleiro" },
    { name: "Teste de Resolução", description: "Derrote Hornet no Caminho Verde" },
    { name: "Prova de Resolução", description: "Derrote Hornet na Borda do Reino" },
    { name: "Observador", description: "Destrua Lurien o Observador" },
    { name: "Besta", description: "Destrua Herrah a Besta" },
    { name: "Professora", description: "Destrua Monomon a Professora" },
    { name: "O Cavaleiro Vazio", description: "Derrote o Cavaleiro Vazio e complete o jogo" },
    { name: "Afortunado", description: "Adquira seu primeiro Amuleto" },
    { name: "Encantado", description: "Adquira metade dos Amuletos de Hallownest" },
    { name: "Abençoado", description: "Adquira todos os Amuletos e receba a bênção de Salubra" },
    { name: "Protegido", description: "Adquira 4 Fragmentos de Máscara" },
    { name: "Mascarado", description: "Adquira todos os Fragmentos de Máscara" },
    { name: "Cheio de Alma", description: "Adquira 3 Fragmentos de Receptáculo" },
    { name: "Alma do Mundo", description: "Adquira todos os Fragmentos de Receptáculo" },
    { name: "Conexão", description: "Abra metade das Estações de Besouro de Hallownest" },
    { name: "Esperança", description: "Abra todas as Estações de Besouro de Hallownest e descubra o Ninho dos Besouros" },
    { name: "Amigo das Larvas", description: "Resgate metade das larvas prisioneiras" },
    { name: "Metamorfose", description: "Resgate todas as larvas prisioneiras" },
    { name: "Cartógrafo", description: "Adquira um mapa de cada área" },
    { name: "Sintonia", description: "Colete 600 Essências" },
    { name: "Despertar", description: "Colete 1800 Essências e desperte o Ferrão dos Sonhos" },
    { name: "Ascensão", description: "Colete 2400 Essências e ouça as palavras finais da Vidente" },
    { name: "Caçador Habilidoso", description: "Registre todas as criaturas de Hallownest no Diário do Caçador" },
    { name: "Verdadeiro Caçador", description: "Receba a Marca do Caçador" },
    { name: "Consolação", description: "Traga a paz para a Pranteadora Cinzenta" },
    { name: "Guerreiro", description: "Complete a Provação do Guerreiro" },
    { name: "Conquistador", description: "Complete a Provação do Conquistador" },
    { name: "Tolo", description: "Complete a Provação do Tolo" },
    { name: "Grande Atuação", description: "Derrote o Líder da Trupe Grimm" },
    { name: "Fim do Pesadelo", description: "Complete o conto da Trupe Grimm" },
    { name: "Alma & Sombra", description: "Complete o Panteão do Cavaleiro" },
    { name: "Abrace o Vazio", description: "Ascenda no Panteão de Hallownest e tome o seu lugar no pico" },
    { name: "Conclusão Pura", description: "Conquiste 112% de conclusão e termine o jogo" },
    { name: "Passagem da Era", description: "Ajude o Arauto a seguir em frente" }
  ],
  "silksong": [
    { name: "Equipped", description: "Acquire your first Tool" },
    { name: "Arsenal", description: "Acquire all Tools" },
    { name: "Bound", description: "Bind your first Silk Skill" },
    { name: "Woven", description: "Bind all Silk Skills" },
    { name: "Claimed", description: "Claim your first Crest" },
    { name: "Consumed", description: "Claim all Crests" },
    { name: "Protected", description: "Acquire 4 Mask Shards" },
    { name: "Masked", description: "Acquire all Mask Shards" },
    { name: "Restored", description: "Acquire 2 Spool Fragments" },
    { name: "Extended", description: "Acquire all Spool Fragments" },
    { name: "Regenerated", description: "Acquire all Silk Hearts" },
    { name: "Cartographer", description: "Acquire a map of each area" },
    { name: "Connected", description: "Open all of Pharloom's Bellways" },
    { name: "Bonded", description: "Learn the Beastling Call" },
    { name: "Transported", description: "Open all of the Citadel's Ventrica Stations" },
    { name: "Keen Hunter", description: "Grant Nuu's wish" },
    { name: "True Hunter", description: "Receive the Hunter's Memento" },
    { name: "Flea Finder", description: "Rescue half of Pharloom's lost fleas" },
    { name: "Fleafriend", description: "Rescue all of Pharloom's lost fleas and receive their final gift" },
    { name: "Liberated", description: "Defeat the Bell Beast" },
    { name: "Pharloom's Welcome", description: "Defeat Lace in Deep Docks" },
    { name: "Servant", description: "Defeat Fourth Chorus" },
    { name: "Fanatic", description: "Defeat Widow" },
    { name: "Judge", description: "Defeat the Last Judge" },
    { name: "Last Dance", description: "Defeat the Cogwork Dancers" },
    { name: "Tragedian", description: "Defeat Trobbio" },
    { name: "White Knight", description: "Defeat Lace in the Cradle" },
    { name: "Grey Ghost", description: "Defeat Phantom" },
    { name: "Heretic", description: "Defeat First Sinner" },
    { name: "Tyrant", description: "Defeat Crust King Khann" },
    { name: "Seed", description: "Defeat Nyleth" },
    { name: "Diva", description: "Defeat Skarrsinger Karmelita" },
    { name: "Lamenter", description: "Defeat the Clover Dancers" },
    { name: "Granted", description: "Grant your first wish" },
    { name: "Glutton", description: "Satiate the Grand Gourmand" },
    { name: "Trail's End", description: "Grant Shakra's wish" },
    { name: "Hero's Call", description: "Defeat Lost Garmond" },
    { name: "Fatal Resolve", description: "Defeat Pinstress" },
    { name: "Entwined", description: "Bind Eva" },
    { name: "Resident", description: "Acquire your own Bellhome" },
    { name: "Harmonious", description: "Learn the Citadel's Threefold song" },
    { name: "Remembrance", description: "Claim the Everbloom from within a distant memory" },
    { name: "Weaver Queen", description: "Defeat Grand Mother Silk and bind her power" },
    { name: "Snared Silk", description: "Defeat Grand Mother Silk and entrap her with the Soul Snare" },
    { name: "Twisted Child", description: "Defeat Grand Mother Silk while cursed" },
    { name: "Sister of the Void", description: "Defeat Lost Lace and free Pharloom" },
    { name: "Passing of the Age", description: "Grant the Herald's wish and finish the game" },
    { name: "Completion", description: "Achieve 100% game completion and finish the game" },
    { name: "Speedrunner", description: "Complete the game in under 5 hours" },
    { name: "Speed Completion", description: "Achieve 100% game completion and finish the game in under 30 hours" },
    { name: "Steel Soul", description: "Finish the game in Steel Soul mode" },
    { name: "Steel Heart", description: "Achieve 100% game completion and finish the game in Steel Soul mode" }
  ],
  "expedition-33" : [
    { name: "Lumière", description: "Embark on the Expedition." },
    { name: "Spring Meadows", description: "Find your way through Spring Meadows." },
    { name: "Flying Waters", description: "Find your way through Flying Waters." },
    { name: "Ancient Sanctuary", description: "Find your way through Ancient Sanctuary." },
    { name: "Gestral Village", description: "Find your way through the Gestral Village." },
    { name: "Esquie's Nest", description: "Find your way through Esquie's Nest." },
    { name: "Stone Wave Cliffs", description: "Find your way through Stone Wave Cliffs." },
    { name: "Forgotten Battlefield", description: "Find your way through Forgotten Battlefield." },
    { name: "Monoco's Station", description: "Find your way through the Grandis Station." },
    { name: "Old Lumière", description: "Find your way through Old Lumière." },
    { name: "First Axon", description: "Defeat the first Axon." },
    { name: "Second Axon", description: "Defeat the second Axon." },
    { name: "Monolith", description: "Reach the Monolith." },
    { name: "Paintress", description: "Defeat the Paintress." },
    { name: "Back to Lumière", description: "Go back to Lumière." },
    { name: "The End", description: "Reach the end." },
    { name: "Plane, Train, and Submarine", description: "Discover all of Esquie’s abilities." },
    { name: "Follow The Trail", description: "Find all of the journals from prior expeditions." },
    { name: "Aiding the Enemy", description: "Finish all of the Nevron quests." },
    { name: "Peace At Last", description: "Beat Simon." },
    { name: "Gestral Games", description: "Win all of the Gestral games." },
    { name: "Clea", description: "Beat Clea." },
    { name: "Endless", description: "Reach the top of the Endless Tower." },
    { name: "Lost Gestrals", description: "Find all of the Lost Gestrals." },
    { name: "À On", description: "Beat the Serpenphare." },
    { name: "Sprong", description: "Beat Sprong." },
    { name: "Noir et Blanc", description: "Solve the Painting Workshop’s mystery." },
    { name: "Sciel", description: "Reach relationship level 7 with Sciel." },
    { name: "Monoco", description: "Reach relationship level 7 with Monoco." },
    { name: "Maelle", description: "Reach relationship level 7 with Maelle." },
    { name: "Lune", description: "Reach relationship level 7 with Lune." },
    { name: "Esquie", description: "Reach relationship level 7 with Esquie." },
    { name: "Weapon Upgrade", description: "Upgrade a weapon once." },
    { name: "Weapon Mastery", description: "Fully upgrade a weapon." },
    { name: "Lumina", description: "Consume a Lumina point." },
    { name: "Expeditioner", description: "Reach level 33." },
    { name: "Trailbreaker", description: "Reach level 66." },
    { name: "Survivor", description: "Reach level 99." },
    { name: "Overcharge", description: "With Gustave, use a fully charged Overcharge that Breaks an enemy." },
    { name: "Perfect Flow", description: "With Lune, consume Stains 4 turns in a row." },
    { name: "Synergy", description: "With Maelle, use Percée on a Marked enemy while in Virtuose Stance." },
    { name: "Maximization", description: "With Sciel, consume 20 Foretell on a single target during Twilight." },
    { name: "Perfection", description: "With Verso, reach Rank S." },
    { name: "Wheel Control", description: "With Monoco, cast an Upgraded Skill 4 turns in a row." },
    { name: "Carreau Parfait", description: "Beat the Chromatic Pétank." },
    { name: "Feet Collection", description: "Acquire all of Monoco’s skills." },
    { name: "Expedition 33", description: "Unlock all playable characters." },
    { name: "Chroma Proficiency", description: "Use a level 3 Gradient Attack." },
    { name: "Connoisseur", description: "Find all 33 music records." },
    { name: "Paint Cage", description: "Break a Paint Cage." },
    { name: "Time to Spill Some Ink", description: "Break an enemy." },
    { name: "Professional", description: "Defeat a boss without taking any damage." },
    { name: "Curious", description: "Witness an optional scene at camp." },
    { name: "Legend", description: "Unlock Esquie." },
    { name: "A Peculiar Encounter", description: "Defeat the Mime in Lumière." }
  ],
  "peak" : [
    { name: "Peak Badge", description: "Reach the PEAK." },
  { name: "Cooking Badge", description: "Cook 20 meals at campfires." },
  { name: "Knot Tying Badge", description: "Place 100m of rope in a single expedition." },
  { name: "Beachcomber Badge", description: "Climb past the SHORE." },
  { name: "Participation Badge", description: "Have a friend escape the island without you." },
  { name: "Trailblazer Badge", description: "Climb past the TROPICS." },
  { name: "Happy Camper Badge", description: "Receive 5 Morale Boosts from campfires." },
  { name: "Alpinist Badge", description: "Climb past the ALPINE." },
  { name: "Volcanology Badge", description: "Climb past the CALDERA." },
  { name: "Bouldering Badge", description: "Place 10 pitons." },
  { name: "Toxicology Badge", description: "Restore 200 total poison by using items." },
  { name: "Foraging Badge", description: "Eat 5 different berries in a single expedition." },
  { name: "Esoterica Badge", description: "Obtain a mystical item." },
  { name: "Lone Wolf Badge", description: "Escape the island in a solo expedition." },
  { name: "Clutch Badge", description: "Resurrect 3 scouts in a single expedition." },
  { name: "Balloon Badge", description: "Escape the island without taking fall damage." },
  { name: "Leave No Trace Badge", description: "Escape the island without placing anything on the mountain." },
  { name: "Speed Climber Badge", description: "Escape the island in under an hour." },
  { name: "Bing Bong Badge", description: "Help Bing Bong escape the island." },
  { name: "Naturalist Badge", description: "Escape the island without eating any packaged food." },
  { name: "Gourmand Badge", description: "Escape the island after cooking and eating a coconut half, a honeycomb, a yellow winterberry, and an egg." },
  { name: "Mycology Badge", description: "Eat four different non-toxic mushrooms in a single expedition." },
  { name: "First Aid Badge", description: "Heal your friends for 100 points of injury in a single expedition." },
  { name: "Survivalist Badge", description: "Escape the island without ever losing consciousness." },
  { name: "Animal Serenading Badge", description: "Play the bugle for a capybara." },
  { name: "Arborist Badge", description: "Reach the top of a really big tree." },
  { name: "Mentorship Badge", description: "Have a 1-on-1 with the Scoutmaster." },
  { name: "Emergency Preparedness Badge", description: "Heal an unconscious friend with an item to save them from death." },
  { name: "High Altitude Badge", description: "Climb 5000m total." },
  { name: "Plunderer Badge", description: "Open 15 luggages in a single expedition." },
  { name: "Bookworm Badge", description: "Read all of Scoutmaster Myres's journal entries." },
  { name: "Endurance Badge", description: "Climb 50m upwards without touching the ground." },
  { name: "Nomad Badge", description: "Climb past the MESA." },
  { name: "Ultimate Badge", description: "Catch a Flying Disc from 100m away." },
  { name: "Cool Cucumber Badge", description: "Climb past the MESA without ever having more than 10% Heat." },
  { name: "Needlepoint Badge", description: "Have a lot of cactuses stuck to you." },
  { name: "Aeronautics Badge", description: "Achieve flight." },
  { name: "24 Karat Badge", description: "Offer The Kiln a worthy sacrifice." },
  { name: "Resourcefulness Badge", description: "Give in to your hunger." },
  { name: "Daredevil Badge", description: "Shoot across the MESA canyon in a Scout Cannon." },
  { name: "Megaentomology Badge", description: "Survive an Antlion attack." },
  { name: "Astronomy Badge", description: "Look a little too closely at the blazing sun." }
  ],
  "metal-gear-snake-eater" : [
    { name: "Young Gun", description: "Stun Ocelot" },
  { name: "Pain Relief", description: "Seize victory against The Pain" },
  { name: "If It Bleeds, We Can Kill It", description: "Seize victory against The Fear" },
  { name: "The End", description: "Seize victory against The End" },
  { name: "Houston, We HAD a Problem", description: "Seize victory against The Fury" },
  { name: "River of Pain", description: "Seize victory against The Sorrow" },
  { name: "Grounded", description: "Seize victory against Volgin" },
  { name: "Shagadelic", description: "Seize victory against The Shagohod" },
  { name: "The Patriot", description: "Seize victory against The Boss" },
  { name: "Mama Said", description: "CQC Slam a guard and knock him out" },
  { name: "Tell Me Where the Bomb Is", description: "CQC Interrogate an enemy" },
  { name: "Like He Just Doesn't Care", description: "Hold up an enemy" },
  { name: "Don't Touch the Sides", description: "Use a knife to remove a bullet" },
  { name: "Ocelot Always Gets His Man", description: "Spot Ocelot in the background when Snake is shaking the President's hand" },
  { name: "Prince Charming", description: "Attack a Kerotan for the first time" },
  { name: "Ugly Duckling", description: "Attack a GA-KO for the first time" },
  { name: "Ralph Called", description: "Make Snake throw up" },
  { name: "Can I Keep It?", description: "Capture any animal alive" },
  { name: "Snake Eater", description: "Eat a snake of any type" },
  { name: "Foodie", description: "Record any food item into your Food Collection" },
  { name: "A Good Man Is Hard to Find", description: "Achieve a Camo Index of 100%" },
  { name: "I Can Totally See You", description: "Achieve a Camo Index of 90% or higher" },
  { name: "Time Paradox", description: "Create the Ocelot Time Paradox" },
  { name: "Taste the poison!", description: "Throw a poisonous creature at an enemy" },
  { name: "Cinephile", description: "Listen to Para-Medic talk about movies after you save" },
  { name: "Friendly Fire", description: "Call in fire support" },
  { name: "Serenity Now", description: "Call one Healing Radio frequency" },
  { name: "Beekeeper", description: "Use bees to harass an enemy" },
  { name: "Just Because", description: "Blow up an armory or provisions storehouse with TNT" },
  { name: "Mostly Dead", description: "Use the Fake Death pill" },
  { name: "You Snooze, You Lose", description: "Sneak up on The End and hold him up to make him drop an item" },
  { name: "The Early End", description: "Kill The End before the boss battle" },
  { name: "Mud Scientist", description: "Get dirty while wearing the Scientist uniform" },
  { name: "War Has Changed", description: "Start a game in New Style" },
  { name: "Old Snake, New Tricks", description: "Start a game in Legacy Style" },
  { name: "Paparazzo Snake", description: "Use Photo Mode for the first time" },
  { name: "Wax On, Wax Off", description: "Parry all of The Boss's CQC attacks" },
  { name: "Believe It or Not", description: "Catch a tsuchinoko" },
  { name: "It Ain't Easy Being Green", description: "Attack all 64 Kerotans" },
  { name: "It's Duck Season", description: "Attack all 64 GA-KOs" },
  { name: "Like a Boss", description: "Clear the game on any difficulty" },
  { name: "PEACE WALKER", description: "Clear the game without killing anyone" },
  { name: "Gastronome", description: "Achieve a 100% for your Food Collection" },
  { name: "A Snake Has Many Skins", description: "Obtain every camouflage uniform and face paint" },
  { name: "FOXHOUND", description: "Acquire the FOXHOUND title" }
  ]
};

function TrophyDetails() {
  const { id } = useParams();
  const trophies = TROPHIES[id] || [];

  const [completedTrophies, setCompletedTrophies] = useState(
    Array(trophies.length).fill(false)
  );

  const toggleCompleted = (index) => {
    const newState = [...completedTrophies];
    newState[index] = !newState[index];
    setCompletedTrophies(newState);
  };

  return (
    <div className="container mt-5 pt-5">
      <h1 className="section-title text-center mb-2">
        {id.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}
      </h1>
      <div className="section-line mb-4"></div>

      <div className="row">
        {trophies.map((trophy, index) => (
          <div key={index} className="col-12 mb-3 d-flex align-items-center">
            <div className={`card p-3 shadow-sm ${completedTrophies[index] ? "completed-rose" : ""}`}>
              <div className="trophy-info">
                <p className="trophy-name mb-1">{trophy.name}</p>
                <p className="trophy-desc mb-0">{trophy.description}</p>
              </div>
            </div>
            <button
              className="btn btn-sm btn-outline-light trophy-btn"
              onClick={() => toggleCompleted(index)}
            >
              {completedTrophies[index] ? "Desmarcar" : "Concluído"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TrophyDetails;