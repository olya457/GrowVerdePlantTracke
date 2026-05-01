import type {
  ActionType,
  Article,
  Pest,
  Plant,
  QuizQuestion,
  VirtualPlant,
} from '../types';

export const onboardingSlides = [
  {
    tag: 'Track & Grow',
    title: 'Monitor Every Step of Growth',
    text: 'Log your plants from day one. Track days since planting, record every care action, and watch your garden thrive with detailed history.',
    imageKey: 'onboardingTrack',
  },
  {
    tag: 'Care & Nurture',
    title: 'Smart Plant Care Reminders',
    text: 'Record watering, fertilizing, pruning and more. Keep a complete care diary for each plant so nothing gets missed.',
    imageKey: 'onboardingCare',
  },
  {
    tag: 'Learn & Play',
    title: 'Grow Your Garden Knowledge',
    text: 'Read expert articles, identify garden pests, take fun quizzes, and build your virtual garden using earned points.',
    imageKey: 'onboardingLearn',
  },
] as const;

export const actionTypes: ActionType[] = [
  'Watered',
  'Fertilized',
  'Pruned',
  'Repotted',
  'Harvested',
  'Observed',
];

export const defaultPlants: Plant[] = [
  {
    id: 'default-cherry-tomato',
    name: 'Cherry Tomato',
    species: 'Solanum lycopersicum',
    plantedAt: '15.03.2026',
    daysGrowing: 46,
    imageKey: 'onboardingCare',
    description:
      'A vibrant cherry tomato plant growing in a sunny garden bed near the south fence. Planted from seed, it has developed strong stems and healthy green leaves. The plant is expected to produce small, sweet tomatoes if watering stays consistent and the soil remains rich in nutrients.',
    actions: [
      {
        id: 'tomato-watered',
        type: 'Watered',
        note: 'Deep watering, soil was quite dry.',
        date: '28.04.2026',
      },
      {
        id: 'tomato-fertilized',
        type: 'Fertilized',
        note: 'Added a mild vegetable fertilizer to support flowering and fruit growth.',
        date: '18.04.2026',
      },
    ],
  },
  {
    id: 'default-sweet-basil',
    name: 'Sweet Basil',
    species: 'Ocimum basilicum',
    plantedAt: '29.03.2026',
    daysGrowing: 32,
    imageKey: 'onboardingTrack',
    description:
      'A fragrant basil plant growing in a medium container near a bright kitchen window. The leaves are soft, green, and aromatic, making it useful for fresh cooking. Regular trimming will help the plant stay bushy instead of becoming tall and weak.',
    actions: [
      {
        id: 'basil-watered',
        type: 'Watered',
        note: 'Light watering after the top layer of soil became dry.',
        date: '29.04.2026',
      },
      {
        id: 'basil-pruned',
        type: 'Pruned',
        note: 'Pinched off the top growth to encourage fuller side branching.',
        date: '21.04.2026',
      },
    ],
  },
  {
    id: 'default-strawberry',
    name: 'Strawberry Plant',
    species: 'Fragaria x ananassa',
    plantedAt: '03.03.2026',
    daysGrowing: 58,
    imageKey: 'onboardingLearn',
    description:
      'A compact strawberry plant growing in a raised bed with morning sun and light afternoon shade. It has started forming healthy leaves and small flower buds. With steady watering and good airflow, it may produce sweet berries during the warmer part of the season.',
    actions: [
      {
        id: 'strawberry-watered',
        type: 'Watered',
        note: 'Watered near the base to keep leaves dry and reduce disease risk.',
        date: '27.04.2026',
      },
      {
        id: 'strawberry-fertilized',
        type: 'Fertilized',
        note: 'Applied a gentle berry-safe fertilizer before the flowering stage.',
        date: '12.04.2026',
      },
      {
        id: 'strawberry-observed',
        type: 'Observed',
        note: 'Small flower buds are forming.',
        date: '30.04.2026',
      },
    ],
  },
  {
    id: 'default-lavender',
    name: 'Lavender',
    species: 'Lavandula angustifolia',
    plantedAt: '18.02.2026',
    daysGrowing: 71,
    imageKey: 'pestBroadMites',
    description:
      'A young lavender plant growing in a sunny outdoor container with well-draining soil. It has narrow silver-green leaves and a pleasant herbal scent. Lavender prefers drier conditions than many garden plants, so it should not be watered too often.',
    actions: [
      {
        id: 'lavender-watered',
        type: 'Watered',
        note: 'Small amount of water added after the soil became fully dry.',
        date: '24.04.2026',
      },
      {
        id: 'lavender-pruned',
        type: 'Pruned',
        note: 'Removed a few weak tips to support a neater, stronger shape.',
        date: '10.04.2026',
      },
    ],
  },
];

export const articles: Article[] = [
  {
    id: 'first-30-days',
    title: 'The First 30 Days After Planting',
    tag: 'Plant Care',
    tags: ['Growth Tracking', 'Beginner Tips'],
    intro:
      'The first 30 days after planting are some of the most important days in a plant life because the plant is adapting, building roots, and reacting to light and soil.',
    body: [
      'In the first week, the plant may not show dramatic visible growth above the soil. Many plants spend early energy developing roots before producing new leaves, stems, or shoots.',
      'By the second and third week, new leaves, stronger stems, brighter color, or a more upright shape can show that the plant is settling in well.',
      'Around the fourth week, comparing the current plant with notes or photos from planting day can reveal slow progress that was hard to notice daily.',
      'Consistency matters more than perfection. Tracking planting days, watering dates, and visible changes helps users make better decisions with every new growing cycle.',
    ],
  },
  {
    id: 'overwatering-danger',
    title: 'Why Overwatering Is More Dangerous Than Forgetting Once',
    tag: 'Watering',
    tags: ['Common Mistakes', 'Root Health'],
    intro:
      'Overwatering is one of the most common reasons houseplants, garden herbs, and young seedlings become weak or die.',
    body: [
      'Roots need moisture, but they also need oxygen. Constantly wet soil can block the air spaces roots depend on.',
      'Root rot often starts quietly below the surface. A droopy plant can look thirsty, and adding more water can make the cycle worse.',
      'A better watering habit begins with checking the soil, not the calendar alone. A reminder should guide inspection before watering.',
      'Watering frequency changes with pot size, soil type, light, room temperature, and season, so each plant needs its own record.',
    ],
  },
  {
    id: 'read-leaves',
    title: 'How to Read Plant Leaves Like a Daily Health Signal',
    tag: 'Plant Care',
    tags: ['Plant Health', 'Observation'],
    intro:
      'Leaves show changes in light, water, nutrients, pests, temperature, and stress. The goal is to notice patterns over time.',
    body: [
      'Yellow leaves can mean natural aging, overwatering, drainage issues, lack of nutrients, or environmental stress.',
      'Brown tips often appear with dry air, irregular watering, fertilizer salts, or direct sun stress.',
      'New growth shows current conditions, while older leaves show the history of past stress.',
      'Notes and photos help reveal whether yellowing is spreading, whether recovery is happening, and whether a care action worked.',
    ],
  },
  {
    id: 'fertilizer-support',
    title: 'Fertilizer Is Food Support, Not Magic',
    tag: 'Fertilizing',
    tags: ['Growth Support', 'Beginner Tips'],
    intro:
      'Fertilizer works best when the plant already has suitable light, proper watering, healthy roots, and enough space to grow.',
    body: [
      'Nitrogen supports leafy growth, phosphorus supports roots and flowering, and potassium helps overall strength.',
      'Too much fertilizer can burn roots, create salt buildup, and encourage weak growth.',
      'Most plants should be fertilized during active growth, not when they are resting in darker or colder months.',
      'A gentle feeding routine plus observation is safer than trying to fix every problem with more nutrients.',
    ],
  },
  {
    id: 'light-engine',
    title: 'Light Is the Hidden Engine of Plant Growth',
    tag: 'Light',
    tags: ['Indoor Plants', 'Growth Tracking'],
    intro:
      'Light drives photosynthesis, which gives plants the energy they need to grow. Without enough light, perfect watering cannot create strong growth.',
    body: [
      'A plant that lacks light may become stretched, pale, thin, or slow-growing.',
      'Too much direct light can scorch or dry plants that prefer bright indirect light.',
      'The same window changes through the seasons, so plant placement should be checked over time.',
      'Tracking location and visible growth helps users decide whether the current light conditions are working.',
    ],
  },
  {
    id: 'pests-start-small',
    title: 'Pest Problems Start Small Before They Become Serious',
    tag: 'Pests',
    tags: ['Plant Health', 'Prevention'],
    intro:
      'Most plant pest problems start quietly with tiny insects, spots, residue, webbing, or unusual leaf damage.',
    body: [
      'Common pests leave different signs: spider mites cause webbing, fungus gnats gather near moist soil, and mealybugs look like white cottony spots.',
      'Stress from poor light, irregular watering, overcrowding, or weak airflow can make pest issues more likely.',
      'When pests appear, inspect leaf undersides, new shoots, stem joints, and soil surface.',
      'Recording when the issue appeared and what action was taken makes future pest checks easier.',
    ],
  },
  {
    id: 'harvest-notes',
    title: 'Harvest Notes Help You Grow Better Next Season',
    tag: 'Harvest',
    tags: ['Garden Journal', 'Seasonal Planning'],
    intro:
      'Harvest notes turn each season into useful experience by recording what produced well, when it produced, and how much was collected.',
    body: [
      'A harvest note can be simple: planting date, first harvest date, quality, and amount.',
      'Records help compare varieties, locations, and care habits across seasons.',
      'Watering, fertilizing, pruning, pest control, and light all influence the final result.',
      'A personal harvest history is more useful than general advice because it comes from the user own garden.',
    ],
  },
  {
    id: 'virtual-garden',
    title: 'A Virtual Garden Can Make Real Plant Care More Motivating',
    tag: 'Virtual Garden',
    tags: ['Quiz Rewards', 'Motivation'],
    intro:
      'A virtual garden adds visible reward for learning, returning to the app, and staying engaged with plant care.',
    body: [
      'Quiz points turn plant knowledge into progress: users learn, earn, and unlock new plants.',
      'A virtual plant responds quickly and creates a sense of achievement while real plants grow slowly.',
      'The best version connects learning with real care, so quiz topics improve decisions in the user actual garden.',
      'Care, learning, and progress come together in one small green world.',
    ],
  },
  {
    id: 'notes-over-memory',
    title: 'Why Plant Notes Are Better Than Memory',
    tag: 'Plant Journal',
    tags: ['Growth Tracking', 'Personal Garden'],
    intro:
      'As the number of plants grows, memory becomes unreliable. Notes keep small but important details in one place.',
    body: [
      'Plant care is based on patterns, and several records are more useful than one isolated memory.',
      'Photos over several weeks can reveal growth, spreading damage, or recovery.',
      'Every growing environment is different, so personal notes adapt general advice to real conditions.',
      'A plant journal becomes a personal growing guide built from real experience.',
    ],
  },
  {
    id: 'simple-routine',
    title: 'How to Build a Simple Plant Care Routine That Actually Works',
    tag: 'Plant Care',
    tags: ['Daily Routine', 'Beginner Tips'],
    intro:
      'A useful care routine is simple enough to repeat without stress and regular enough to catch changes early.',
    body: [
      'Observation comes first: check leaves, soil, color, pests, and overall posture before taking action.',
      'Care should match the current condition of the plant, not only a fixed calendar.',
      'A weekly routine can include photos, damaged leaf removal, pest inspection, pot rotation, and notes.',
      'The routine should make plant care calmer and more consistent, not turn it into a chore.',
    ],
  },
  {
    id: 'planting-day',
    title: 'What Planting Day Can Tell You About Growth',
    tag: 'Growth Tracking',
    tags: ['Planting Day', 'Plant Journal'],
    intro:
      'The planting day is the starting point of a plant story and creates a timeline for future growth and care.',
    body: [
      'A seedling that looks small after five days may be normal, while no progress after weeks may deserve a closer check.',
      'Many plant stages are time-based: germination, root establishment, flowering, and harvest all follow rough timelines.',
      'Planting dates help with care timing, such as when to fertilize, support, prune, or transplant.',
      'Over time, planting records become a personal garden calendar.',
    ],
  },
  {
    id: 'soil-vs-mix',
    title: 'The Difference Between Garden Soil and Potting Mix',
    tag: 'Soil',
    tags: ['Containers', 'Beginner Tips'],
    intro:
      'Garden soil and potting mix can look similar, yet they behave very differently in containers.',
    body: [
      'Garden soil may compact in pots and reduce drainage and oxygen around roots.',
      'Potting mix is usually lighter and designed to balance airflow, drainage, and moisture.',
      'Potting mix can break down over time, lose structure, or develop fertilizer salt buildup.',
      'Recording soil type gives users another clue when understanding plant behavior.',
    ],
  },
  {
    id: 'seasonal-timing',
    title: 'Seasonal Gardening Is About Timing, Not Just Effort',
    tag: 'Seasonal Care',
    tags: ['Garden Calendar', 'Plant Planning'],
    intro:
      'Plants respond to light, temperature, humidity, rainfall, and day length, so care routines change with the seasons.',
    body: [
      'Spring is often for preparation, seed starting, repotting, and new growth.',
      'Summer brings faster growth, stronger sunlight, higher water demand, and more pest pressure.',
      'Autumn is a transition season for harvest notes, cleanup, seed saving, and review.',
      'Winter is quieter, but indoor plants may need less water because growth slows in lower light.',
    ],
  },
  {
    id: 'seed-speed',
    title: 'Why Some Seeds Sprout Faster Than Others',
    tag: 'Seed Starting',
    tags: ['Growth Tracking', 'Beginner Tips'],
    intro:
      'Seed sprouting speed depends on plant species, seed age, temperature, moisture, light needs, and planting depth.',
    body: [
      'Temperature is one of the strongest factors in germination.',
      'Seeds need moisture, but soggy soil can rot them before they sprout.',
      'Planting depth matters because tiny seeds may not have enough energy to reach the surface if buried too deeply.',
      'A seed log helps users learn which seeds are reliable and which require patience.',
    ],
  },
  {
    id: 'photo-tracking',
    title: 'How to Use Photos to Track Plant Progress',
    tag: 'Growth Tracking',
    tags: ['Plant Journal', 'Photos'],
    intro:
      'Photos are useful because plant growth often happens slowly and can be hard to notice day by day.',
    body: [
      'Consistent angle, light, and distance make photo comparisons much easier.',
      'Photos can show whether yellowing, pest damage, brown tips, or wilting are spreading or improving.',
      'Notes explain what happened around the time of the photo, such as watering, moving, or fertilizing.',
      'Long-term photos become a personal archive of the user progress as a gardener.',
    ],
  },
  {
    id: 'beginner-friendly',
    title: 'Beginner-Friendly Plants Still Need Attention',
    tag: 'Beginner Tips',
    tags: ['Plant Care', 'Easy Plants'],
    intro:
      'Easy plants are more forgiving, but they still need suitable light, proper watering, healthy soil, and observation.',
    body: [
      'Low-maintenance does not mean a plant will thrive in any dark corner or survive without proper watering.',
      'Beginner-friendly plants give users time to learn because they often recover from small mistakes.',
      'Tracking easy plants teaches slower patterns such as soil drying, new leaf growth, and seasonal change.',
      'The goal is to understand the plant, not ignore it.',
    ],
  },
  {
    id: 'repotting',
    title: 'How to Know When a Plant Needs Repotting',
    tag: 'Repotting',
    tags: ['Root Health', 'Plant Care'],
    intro:
      'Repotting helps when roots outgrow the container, soil becomes compacted, or drainage no longer works well.',
    body: [
      'Roots growing out of drainage holes can show that the plant is running out of space.',
      'A plant may also need repotting if it dries much faster than before, stops growing during active season, or becomes unstable.',
      'Not every struggling plant needs a bigger pot; light, watering, pests, and nutrients should be checked first.',
      'Tracking repotting dates prevents unnecessary disturbance and helps users care for roots as carefully as leaves.',
    ],
  },
  {
    id: 'small-spaces',
    title: 'Small Garden Spaces Can Still Be Productive',
    tag: 'Garden Planning',
    tags: ['Balcony Garden', 'Small Space'],
    intro:
      'A garden does not need to be large to be useful, beautiful, or productive. Planning matters more than size.',
    body: [
      'Small-space gardening begins with understanding available light.',
      'Containers need enough root space, drainage, and suitable potting mix.',
      'Vertical space such as shelves, hanging pots, and plant stands can expand a small garden.',
      'A tracker keeps watering, fertilizing, pruning, and harvest notes organized as the garden grows.',
    ],
  },
  {
    id: 'patterns',
    title: 'Why Plant Care Gets Easier When You Learn Patterns',
    tag: 'Plant Care',
    tags: ['Growth Tracking', 'Personal Experience'],
    intro:
      'Experienced gardeners make better decisions because they notice patterns in watering, light, growth, pests, and seasons.',
    body: [
      'Patterns are built through observation and repetition.',
      'A plant that droops every time it dries fully may need more consistent moisture, while another may need longer dry periods.',
      'Pest patterns also appear, such as fungus gnats after wet soil or spider mites during dry indoor conditions.',
      'A tracker turns daily actions into useful information that makes plant care feel less random.',
    ],
  },
];

export const pests: Pest[] = [
  {
    id: 'spider-mites',
    name: 'Spider Mites',
    scientific: 'Tetranychidae',
    risk: 'Medium Risk',
    imageKey: 'pestSpiderMites',
    description:
      'Tiny arachnid pests that often appear on indoor plants, vegetables, herbs, and greenhouse crops. They feed by piercing plant cells and sucking out sap.',
    symptoms: [
      'Fine webbing between leaves and stems',
      'Tiny yellow or pale speckles on leaves',
      'Leaves becoming dull, dry, or bronze-colored',
      'Leaf curling, drying, or falling off',
      'Very small moving dots on leaf undersides',
    ],
    prevention: [
      'Keep plants regularly inspected, especially leaf undersides',
      'Increase humidity around sensitive indoor plants',
      'Avoid letting plants become stressed by drought',
      'Rinse leaves gently to remove dust and early pests',
      'Isolate new plants before placing them near others',
    ],
  },
  {
    id: 'whiteflies',
    name: 'Whiteflies',
    scientific: 'Aleyrodidae',
    risk: 'High Risk',
    imageKey: 'pestWhiteflies',
    description:
      'Small white flying insects that gather on leaf undersides and scatter when the plant is touched. They feed on sap and produce sticky honeydew.',
    symptoms: [
      'Clouds of tiny white insects flying when leaves are disturbed',
      'Yellowing leaves and weak plant growth',
      'Sticky honeydew on leaves',
      'Black sooty mold growing on sticky residue',
      'Leaves wilting, curling, or dropping early',
    ],
    prevention: [
      'Check the undersides of leaves regularly',
      'Use yellow sticky traps to monitor early activity',
      'Avoid overcrowding plants',
      'Remove heavily infested leaves when needed',
      'Keep plants healthy with balanced watering and feeding',
    ],
  },
  {
    id: 'fungus-gnats',
    name: 'Fungus Gnats',
    scientific: 'Sciaridae',
    risk: 'Medium Risk',
    imageKey: 'pestFungusGnats',
    description:
      'Small dark flies commonly seen around moist potting soil, especially on indoor plants and seedlings.',
    symptoms: [
      'Small black flies hovering near soil surface',
      'Larvae visible in very moist soil',
      'Seedlings growing weakly or collapsing',
      'Soil staying wet for long periods',
      'Increased pest activity after overwatering',
    ],
    prevention: [
      'Allow the top layer of soil to dry between waterings',
      'Avoid keeping pots constantly wet',
      'Use well-draining potting mix',
      'Remove dead leaves from the soil surface',
      'Use sticky traps to monitor adult gnats',
    ],
  },
  {
    id: 'mealybugs',
    name: 'Mealybugs',
    scientific: 'Pseudococcidae',
    risk: 'High Risk',
    imageKey: 'pestMealybugs',
    description:
      'Soft-bodied insects covered with a white waxy coating that often looks like tiny cotton clumps.',
    symptoms: [
      'White cotton-like clusters on stems or leaves',
      'Sticky honeydew on plant surfaces',
      'Yellowing leaves and slow growth',
      'Deformed or weakened new growth',
      'Ants attracted to the sticky residue',
    ],
    prevention: [
      'Inspect new plants carefully before adding them to a collection',
      'Check leaf joints and hidden stem areas often',
      'Avoid over-fertilizing with nitrogen',
      'Remove isolated pests early before they spread',
      'Keep plants spaced apart for better airflow and inspection',
    ],
  },
  {
    id: 'scale-insects',
    name: 'Scale Insects',
    scientific: 'Coccoidea',
    risk: 'Medium Risk',
    imageKey: 'pestScaleInsects',
    description:
      'Small pests that attach to stems, leaves, and branches like tiny bumps or shells while feeding on plant sap.',
    symptoms: [
      'Small brown, tan, white, or gray bumps on stems and leaves',
      'Sticky residue on leaves or nearby surfaces',
      'Yellowing leaves and reduced growth',
      'Black sooty mold on honeydew',
      'Branches or stems becoming weak over time',
    ],
    prevention: [
      'Inspect woody stems and leaf undersides regularly',
      'Isolate new plants before placing them with others',
      'Prune heavily affected areas when necessary',
      'Avoid plant stress from poor light or irregular watering',
      'Keep leaves clean so pests are easier to notice',
    ],
  },
  {
    id: 'thrips',
    name: 'Thrips',
    scientific: 'Thysanoptera',
    risk: 'Medium Risk',
    imageKey: 'pestThrips',
    description:
      'Very small slender insects that damage leaves, flowers, and young shoots by scraping plant tissue and feeding on sap.',
    symptoms: [
      'Silvery or bronze streaks on leaves',
      'Distorted flowers or damaged petals',
      'Tiny black specks of insect waste',
      'Deformed young leaves or shoots',
      'Pale patches and rough-looking leaf surfaces',
    ],
    prevention: [
      'Inspect flowers and new growth often',
      'Remove damaged flowers or leaves early',
      'Use sticky traps to monitor activity',
      'Avoid bringing infested cut flowers near plants',
      'Keep plants healthy and reduce dry stress',
    ],
  },
  {
    id: 'leaf-miners',
    name: 'Leaf Miners',
    scientific: 'Agromyzidae',
    risk: 'Low Risk',
    imageKey: 'pestLeafMiners',
    description:
      'Small insect larvae that live inside leaves and create winding pale tunnels as they feed.',
    symptoms: [
      'White or pale winding trails inside leaves',
      'Blotchy patches between leaf surfaces',
      'Damaged leaves becoming dry or brown',
      'Reduced quality of edible leafy greens',
      'Small larvae sometimes visible inside mined areas',
    ],
    prevention: [
      'Remove affected leaves before larvae mature',
      'Check young leafy crops frequently',
      'Use row covers for vulnerable outdoor plants',
      'Keep the garden free from heavily infested plant debris',
      'Rotate leafy crops when possible',
    ],
  },
  {
    id: 'caterpillars',
    name: 'Caterpillars',
    scientific: 'Lepidoptera larvae',
    risk: 'High Risk',
    imageKey: 'pestCaterpillars',
    description:
      'Larvae of butterflies and moths that can feed heavily on leaves, stems, flowers, or fruits.',
    symptoms: [
      'Chewed holes in leaves',
      'Missing leaf edges or skeletonized leaves',
      'Dark droppings on leaves or soil',
      'Damaged flowers, buds, or fruits',
      'Caterpillars hiding on leaf undersides or stems',
    ],
    prevention: [
      'Inspect plants in the morning and evening',
      'Remove visible caterpillars by hand when safe and practical',
      'Protect young plants with garden netting or row covers',
      'Encourage birds and beneficial insects in the garden',
      'Remove damaged leaves and monitor new chewing marks',
    ],
  },
  {
    id: 'slugs-and-snails',
    name: 'Slugs and Snails',
    scientific: 'Gastropoda',
    risk: 'Medium Risk',
    imageKey: 'pestSlugsAndSnails',
    description:
      'Soft-bodied garden pests that feed mostly at night or during damp weather.',
    symptoms: [
      'Irregular holes in leaves',
      'Slime trails on soil, pots, or leaves',
      'Seedlings disappearing overnight',
      'Chewed fruit near the ground',
      'More damage after rain or heavy watering',
    ],
    prevention: [
      'Reduce hiding places such as boards, weeds, and dense debris',
      'Water in the morning instead of late evening',
      'Keep young seedlings protected during wet periods',
      'Use barriers around vulnerable plants',
      'Check plants after rain or during damp evenings',
    ],
  },
  {
    id: 'japanese-beetles',
    name: 'Japanese Beetles',
    scientific: 'Popillia japonica',
    risk: 'High Risk',
    imageKey: 'pestJapaneseBeetles',
    description:
      'Metallic green and bronze beetles that feed on leaves, flowers, and fruits of many garden plants.',
    symptoms: [
      'Leaves eaten into a lace-like skeleton pattern',
      'Flowers damaged or shredded',
      'Beetles feeding in groups on sunny leaves',
      'Browned leaf tissue after heavy feeding',
      'Reduced flowering or fruit quality',
    ],
    prevention: [
      'Inspect plants regularly during beetle season',
      'Remove beetles early in the morning when they are less active',
      'Avoid planting highly attractive plants in concentrated groups',
      'Keep plants healthy so they recover better from damage',
      'Monitor nearby lawn areas where larvae may develop',
    ],
  },
  {
    id: 'cutworms',
    name: 'Cutworms',
    scientific: 'Noctuidae larvae',
    risk: 'Medium Risk',
    imageKey: 'pestCutworms',
    description:
      'Moth larvae that hide in soil during the day and cut young seedlings at or near the soil line at night.',
    symptoms: [
      'Seedlings cut off near soil level',
      'Young plants collapsing overnight',
      'Chewed stems close to the ground',
      'Larvae hiding in topsoil near damaged plants',
      'Missing or damaged new transplants',
    ],
    prevention: [
      'Check soil around young plants after damage appears',
      'Keep planting beds clear of weeds and debris',
      'Use protective collars around tender seedlings',
      'Inspect new transplants during the first weeks',
      'Turn soil gently before planting to expose hidden larvae',
    ],
  },
  {
    id: 'leafhoppers',
    name: 'Leafhoppers',
    scientific: 'Cicadellidae',
    risk: 'Medium Risk',
    imageKey: 'pestLeafhoppers',
    description:
      'Small wedge-shaped insects that jump quickly when disturbed and feed by sucking sap from leaves and stems.',
    symptoms: [
      'Tiny pale spots or stippling on leaves',
      'Leaves curling, yellowing, or drying at edges',
      'Small insects jumping away when touched',
      'Weak or stunted plant growth',
      'Possible disease-like discoloration or distortion',
    ],
    prevention: [
      'Remove weeds that may host leafhoppers',
      'Use row covers for young vulnerable plants',
      'Inspect leaf undersides and stems regularly',
      'Avoid excessive nitrogen fertilizing',
      'Encourage beneficial insects in the garden',
    ],
  },
  {
    id: 'ants',
    name: 'Ants',
    scientific: 'Formicidae',
    risk: 'Low Risk',
    imageKey: 'pestAnts',
    description:
      'Ants usually do not damage plants directly, but they can warn of honeydew-producing pest problems.',
    symptoms: [
      'Ants moving along stems or leaves',
      'Sticky honeydew on plant surfaces',
      'Aphids, scale, or mealybugs nearby',
      'Soil disturbance around pots or garden beds',
      'Increased pest activity on tender new growth',
    ],
    prevention: [
      'Look for sap-sucking pests when ants appear on plants',
      'Remove honeydew-producing pests early',
      'Keep plant surfaces clean when possible',
      'Avoid leaving sweet residues near indoor plants',
      'Improve pest control before ant activity increases',
    ],
  },
  {
    id: 'root-knot-nematodes',
    name: 'Root-Knot Nematodes',
    scientific: 'Meloidogyne',
    risk: 'High Risk',
    imageKey: 'pestRootKnotNematodes',
    description:
      'Microscopic roundworms that live in soil and attack roots, causing swollen knots or galls.',
    symptoms: [
      'Stunted growth despite regular care',
      'Yellowing leaves and weak plants',
      'Wilting during warm parts of the day',
      'Swollen knots or galls on roots',
      'Poor harvest or reduced plant vigor',
    ],
    prevention: [
      'Rotate crops in garden beds',
      'Avoid moving contaminated soil between beds',
      'Remove infected roots after harvest',
      'Improve soil health with organic matter',
      'Choose resistant plant varieties when available',
    ],
  },
  {
    id: 'earwigs',
    name: 'Earwigs',
    scientific: 'Dermaptera',
    risk: 'Medium Risk',
    imageKey: 'pestEarwigs',
    description:
      'Night-active insects that can feed on soft leaves, flowers, seedlings, and ripe fruit when populations are high.',
    symptoms: [
      'Ragged holes in leaves or flower petals',
      'Damage appearing mostly overnight',
      'Earwigs hiding under pots, mulch, or debris',
      'Chewed seedlings or soft new growth',
      'Damage on ripe fruit close to the ground',
    ],
    prevention: [
      'Reduce damp hiding places near plants',
      'Keep garden debris under control',
      'Avoid very thick mulch around vulnerable seedlings',
      'Check under pots and boards regularly',
      'Protect young plants until they become stronger',
    ],
  },
  {
    id: 'flea-beetles',
    name: 'Flea Beetles',
    scientific: 'Chrysomelidae',
    risk: 'Medium Risk',
    imageKey: 'pestFleaBeetles',
    description:
      'Tiny jumping beetles that chew many small holes in leaves, creating a shot-hole appearance.',
    symptoms: [
      'Many tiny round holes in leaves',
      'Jumping black or bronze beetles when disturbed',
      'Damaged young seedlings',
      'Slower growth after leaf injury',
      'Leaves looking peppered or shredded',
    ],
    prevention: [
      'Protect young crops with row covers',
      'Keep garden beds clean of plant debris',
      'Water and feed seedlings properly to support recovery',
      'Remove weeds that may host beetles',
      'Monitor early in the growing season',
    ],
  },
  {
    id: 'colorado-potato-beetles',
    name: 'Colorado Potato Beetles',
    scientific: 'Leptinotarsa decemlineata',
    risk: 'High Risk',
    imageKey: 'pestColoradoPotatoBeetles',
    description:
      'Striped beetles that attack potatoes, tomatoes, eggplants, and related plants. Both adults and larvae feed heavily on leaves.',
    symptoms: [
      'Large sections of leaves chewed away',
      'Orange-red larvae feeding in groups',
      'Yellow-orange egg clusters under leaves',
      'Striped adult beetles on potato-family plants',
      'Reduced plant strength and smaller harvests',
    ],
    prevention: [
      'Check leaf undersides for eggs regularly',
      'Remove adults, larvae, and egg clusters early',
      'Rotate potato-family crops each season',
      'Avoid leaving volunteer potato plants in beds',
      'Encourage beneficial insects where possible',
    ],
  },
  {
    id: 'springtails',
    name: 'Springtails',
    scientific: 'Collembola',
    risk: 'Low Risk',
    imageKey: 'pestSpringtails',
    description:
      'Tiny jumping soil organisms often found in moist potting mix. They are usually not dangerous to healthy plants.',
    symptoms: [
      'Tiny white or gray insects jumping on soil surface',
      'More activity after watering',
      'Moist soil that dries slowly',
      'Possible mold or algae on soil surface',
      'Usually little or no direct leaf damage',
    ],
    prevention: [
      'Let the top layer of soil dry between waterings',
      'Improve drainage in containers',
      'Remove decaying leaves from pot surfaces',
      'Avoid constantly damp soil conditions',
      'Use fresh, clean potting mix when repotting plants',
    ],
  },
  {
    id: 'broad-mites',
    name: 'Broad Mites',
    scientific: 'Polyphagotarsonemus latus',
    risk: 'Medium Risk',
    imageKey: 'pestBroadMites',
    description:
      'Extremely tiny mites that attack tender new growth, flowers, and young leaves, causing distorted growth.',
    symptoms: [
      'Twisted, curled, or hardened new leaves',
      'Deformed growing tips',
      'Bronzed or shiny leaf surfaces',
      'Flower buds dropping or developing poorly',
      'Plant growth becoming stunted and compact',
    ],
    prevention: [
      'Inspect new growth often for unusual distortion',
      'Isolate new plants before adding them to a collection',
      'Avoid overcrowding plants in warm, humid spaces',
      'Remove heavily damaged growing tips when necessary',
      'Keep tools and hands clean when moving between plants',
    ],
  },
  {
    id: 'two-spotted-spider-mites',
    name: 'Two-Spotted Spider Mites',
    scientific: 'Tetranychus urticae',
    risk: 'Medium Risk',
    imageKey: 'pestTwoSpottedSpiderMites',
    description:
      'One of the most common mite pests on indoor plants, greenhouse crops, vegetables, berries, and ornamentals.',
    symptoms: [
      'Tiny pale dots or stippling on leaves',
      'Fine webbing on leaves, stems, and buds',
      'Leaves turning yellow, bronze, or dusty-looking',
      'Premature leaf drop during heavy infestation',
      'Small moving mites visible under leaves',
    ],
    prevention: [
      'Check leaf undersides during warm, dry periods',
      'Keep plants from becoming drought-stressed',
      'Rinse foliage gently to reduce dust and early mites',
      'Increase humidity for plants that tolerate it',
      'Separate affected plants from healthy ones quickly',
    ],
  },
  {
    id: 'tomato-hornworms',
    name: 'Tomato Hornworms',
    scientific: 'Manduca quinquemaculata',
    risk: 'High Risk',
    imageKey: 'pestTomatoHornworms',
    description:
      'Large green caterpillars that feed heavily on tomato, pepper, eggplant, and potato-family plants.',
    symptoms: [
      'Large missing sections of leaves',
      'Bare stems where foliage was eaten',
      'Dark droppings on leaves or soil',
      'Damaged green tomatoes or young fruits',
      'Large green caterpillars hiding along stems',
    ],
    prevention: [
      'Inspect tomato-family plants regularly',
      'Look for droppings as an early warning sign',
      'Remove visible caterpillars by hand when safe',
      'Encourage beneficial wasps and birds in the garden',
      'Check leaf undersides and inner stems carefully',
    ],
  },
  {
    id: 'squash-bugs',
    name: 'Squash Bugs',
    scientific: 'Anasa tristis',
    risk: 'Medium Risk',
    imageKey: 'pestSquashBugs',
    description:
      'Sap-feeding insects that commonly attack squash, pumpkins, zucchini, cucumbers, and related plants.',
    symptoms: [
      'Leaves wilting even when soil is moist',
      'Yellow or brown spots on leaves',
      'Bronze egg clusters on leaf undersides',
      'Gray-brown insects hiding near stems',
      'Vines weakening or collapsing in severe cases',
    ],
    prevention: [
      'Check leaf undersides for eggs often',
      'Remove plant debris where adults can hide',
      'Inspect the base of vines regularly',
      'Rotate cucurbit crops when possible',
      'Keep plants healthy with consistent watering',
    ],
  },
  {
    id: 'cabbage-worms',
    name: 'Cabbage Worms',
    scientific: 'Pieris rapae larvae',
    risk: 'High Risk',
    imageKey: 'pestCabbageWorms',
    description:
      'Green caterpillars that feed on cabbage, broccoli, kale, cauliflower, Brussels sprouts, and other cabbage-family crops.',
    symptoms: [
      'Chewed holes in cabbage-family leaves',
      'Green caterpillars on leaf undersides',
      'Dark green droppings on leaves',
      'Damaged heads of cabbage or broccoli',
      'Ragged leaf edges and weakened seedlings',
    ],
    prevention: [
      'Cover young cabbage-family crops with row covers',
      'Inspect leaf undersides regularly',
      'Remove caterpillars and eggs early',
      'Keep weeds from the cabbage family under control',
      'Encourage beneficial insects in the garden',
    ],
  },
  {
    id: 'onion-thrips',
    name: 'Onion Thrips',
    scientific: 'Thrips tabaci',
    risk: 'Medium Risk',
    imageKey: 'pestOnionThrips',
    description:
      'Small narrow insects that often attack onions, garlic, leeks, cabbage, cucumbers, and greenhouse crops.',
    symptoms: [
      'Silvery streaks on onion or garlic leaves',
      'Pale patches and rough leaf surfaces',
      'Leaf tips turning brown or dry',
      'Distorted young growth',
      'Tiny insects hiding between leaf bases',
    ],
    prevention: [
      'Avoid overcrowding onion-family crops',
      'Water consistently to reduce dry stress',
      'Remove weeds that can host thrips',
      'Inspect plants during hot, dry weather',
      'Rotate crops to reduce recurring infestations',
    ],
  },
  {
    id: 'pill-bugs',
    name: 'Pill Bugs',
    scientific: 'Armadillidiidae',
    risk: 'Low Risk',
    imageKey: 'pestPillBugs',
    description:
      'Small gray crustaceans that usually feed on decaying organic matter but may chew tender seedlings in damp areas.',
    symptoms: [
      'Small bites on tender seedlings',
      'Chewed soft stems near soil level',
      'Damage on strawberries or fruit resting on soil',
      'Many pill bugs hiding under pots or mulch',
      'More activity in damp, shaded areas',
    ],
    prevention: [
      'Reduce excess moisture around seedlings',
      'Remove thick debris and hiding places near young plants',
      'Keep fruit lifted away from wet soil',
      'Water in the morning when possible',
      'Protect delicate seedlings until stems become stronger',
    ],
  },
  {
    id: 'leaf-footed-bugs',
    name: 'Leaf-Footed Bugs',
    scientific: 'Coreidae',
    risk: 'Medium Risk',
    imageKey: 'pestLeafFootedBugs',
    description:
      'Large sap-feeding insects named for the flattened leaf-like shapes on their hind legs.',
    symptoms: [
      'Small puncture marks on fruits',
      'Discolored or sunken spots on fruit skin',
      'Deformed or poorly developing fruit',
      'Groups of nymphs on stems or fruit clusters',
      'Adult bugs with widened hind legs',
    ],
    prevention: [
      'Inspect fruiting plants during warm seasons',
      'Remove egg clusters and young nymphs early',
      'Keep weeds and plant debris under control',
      'Use physical barriers for vulnerable crops when practical',
      'Harvest ripe fruits promptly to reduce attraction',
    ],
  },
];

export const quizQuestions: QuizQuestion[] = [
  {
    id: 'overwatering-oxygen',
    question: 'What is the main reason overwatering can harm a plant?',
    answers: [
      'It makes leaves grow too fast',
      'It blocks oxygen around the roots',
      'It makes sunlight weaker',
      'It stops the plant from producing seeds',
    ],
    correctIndex: 1,
    didYouKnow:
      'Roots need both water and air. When soil stays soaked for too long, tiny air spaces fill with water and roots can begin to rot.',
  },
  {
    id: 'planting-date',
    question: 'Why is tracking the planting date useful?',
    answers: [
      'It helps measure the plant growth stage over time',
      'It changes the color of the leaves',
      'It prevents all pests automatically',
      'It makes fertilizer unnecessary',
    ],
    correctIndex: 0,
    didYouKnow:
      'Many plants grow according to predictable stages. Knowing days since planting helps you understand whether the plant is adjusting, growing, flowering, or ready for harvest.',
  },
  {
    id: 'not-enough-light',
    question: 'Which sign often suggests that a plant may not be getting enough light?',
    answers: [
      'Soil drying instantly after watering',
      'Leaves becoming unusually salty',
      'Stems stretching and leaning toward a window',
      'Roots turning into flowers',
    ],
    correctIndex: 2,
    didYouKnow:
      'When plants stretch toward light, this is often called leggy growth. It usually means the plant is trying to reach a brighter place.',
  },
  {
    id: 'before-watering',
    question: 'What should you usually check before watering a plant?',
    answers: [
      'The color of the pot only',
      'The plant name tag only',
      'The room decoration style',
      'The moisture level of the soil',
    ],
    correctIndex: 3,
    didYouKnow:
      'Watering by schedule alone can be risky. A reminder should help you check the plant, but soil condition should guide the final decision.',
  },
  {
    id: 'honeydew',
    question: 'What does sticky honeydew on leaves often indicate?',
    answers: [
      'Sap-sucking pests may be present',
      'The plant is producing fruit',
      'The plant needs more direct sun',
      'The soil is too sandy',
    ],
    correctIndex: 0,
    didYouKnow:
      'Aphids, whiteflies, mealybugs, and scale insects can produce sticky honeydew. This residue may also attract ants or lead to black sooty mold.',
  },
  {
    id: 'seedlings-heavy-water',
    question: 'Why should young seedlings be protected from heavy watering?',
    answers: [
      'They do not need roots',
      'Their tender roots can be damaged by soggy soil',
      'Water makes seeds disappear',
      'It makes leaves grow underground',
    ],
    correctIndex: 1,
    didYouKnow:
      'Seedlings are delicate. Too much moisture can encourage fungal problems and weak root development, especially when airflow is poor.',
  },
  {
    id: 'fine-webbing',
    question: 'Which pest is often linked to fine webbing on leaves and stems?',
    answers: ['Slugs', 'Fungus gnats', 'Spider mites', 'Cutworms'],
    correctIndex: 2,
    didYouKnow:
      'Spider mites are tiny arachnids related to spiders. They often become worse in warm, dry conditions.',
  },
  {
    id: 'pest-first-step',
    question: 'What is the safest first step when you notice a possible pest problem on one plant?',
    answers: [
      'Water all plants heavily',
      'Add extra fertilizer immediately',
      'Move the plant into stronger sun without checking',
      'Isolate the affected plant from healthy plants',
    ],
    correctIndex: 3,
    didYouKnow:
      'Isolation helps stop pests from spreading while you inspect the plant and choose the right treatment.',
  },
  {
    id: 'fertilizer-stressed',
    question: 'Why can fertilizer damage a stressed plant?',
    answers: [
      'A weak plant may not use nutrients properly',
      'Fertilizer removes all sunlight',
      'Fertilizer turns soil into water',
      'Fertilizer stops roots from growing forever',
    ],
    correctIndex: 0,
    didYouKnow:
      'Fertilizer supports growth, but it cannot fix poor light, root rot, pests, or severe stress.',
  },
  {
    id: 'hardening-off',
    question: 'What does hardening off mean for young plants?',
    answers: [
      'Painting plant pots with hard coating',
      'Slowly adapting seedlings to outdoor conditions',
      'Removing all leaves before planting',
      'Freezing seeds before watering them',
    ],
    correctIndex: 1,
    didYouKnow:
      'Seedlings grown indoors can be shocked by direct sun, wind, and temperature changes. Hardening off helps them adjust gradually.',
  },
  {
    id: 'harvest-record',
    question: 'Which plant record is especially useful for future seasonal planning?',
    answers: [
      'Favorite garden color only',
      'Number of clouds in the sky',
      'Harvest date and harvest amount',
      'The shape of the watering can',
    ],
    correctIndex: 2,
    didYouKnow:
      'Harvest notes help you remember which plants performed well, when they produced, and what you may want to grow again next season.',
  },
  {
    id: 'yellow-lower-leaves',
    question: 'What does yellowing of many lower leaves often suggest?',
    answers: [
      'The plant is turning into a flower',
      'The leaves are becoming stronger',
      'The plant never needs water again',
      'Possible overwatering, nutrient issues, or natural aging',
    ],
    correctIndex: 3,
    didYouKnow:
      'Yellow leaves can have different causes. Notes about watering, light, fertilizer, and plant age help explain the real reason.',
  },
  {
    id: 'photos-useful',
    question: 'Why are photos useful in plant tracking?',
    answers: [
      'They help compare plant changes over time',
      'They replace watering completely',
      'They make pests disappear instantly',
      'They stop the plant from needing light',
    ],
    correctIndex: 0,
    didYouKnow:
      'Plant growth can be slow and hard to notice daily. Weekly photos can reveal changes in height, color, fullness, and recovery.',
  },
  {
    id: 'fungus-gnats-condition',
    question: 'Which condition often attracts fungus gnats?',
    answers: [
      'Dry desert sand only',
      'Constantly moist potting soil',
      'Too much direct moonlight',
      'Leaves facing north',
    ],
    correctIndex: 1,
    didYouKnow:
      'Fungus gnats are common in indoor pots where soil stays damp. Letting the top layer dry between waterings can help reduce them.',
  },
  {
    id: 'repotting-sign',
    question: 'What is a common sign that a plant may need repotting?',
    answers: [
      'Roots growing out of drainage holes',
      'The plant has a pretty leaf shape',
      'The pot is the same color as the wall',
      'The plant was watered yesterday',
    ],
    correctIndex: 0,
    didYouKnow:
      'Roots appearing from drainage holes can mean the plant has outgrown its current container, though repotting should be based on several signs.',
  },
  {
    id: 'potting-mix',
    question: 'What is the main advantage of using potting mix for container plants?',
    answers: [
      'It makes pots invisible',
      'It prevents all insects forever',
      'It usually gives roots better air and drainage',
      'It removes the need for sunlight',
    ],
    correctIndex: 2,
    didYouKnow:
      'Garden soil can compact in containers. Potting mix is usually lighter and better suited for roots growing in limited space.',
  },
  {
    id: 'mealybugs',
    question: 'Which pest often looks like small white cottony clusters?',
    answers: ['Mealybugs', 'Leaf miners', 'Slugs', 'Japanese beetles'],
    correctIndex: 0,
    didYouKnow:
      'Mealybugs hide in leaf joints and protected areas. Early detection is important because they can become difficult to remove.',
  },
  {
    id: 'too-much-nitrogen',
    question: 'Why should you avoid fertilizing too much with nitrogen?',
    answers: [
      'It makes soil turn blue',
      'It can encourage soft growth that attracts pests',
      'It makes plants stop needing roots',
      'It removes all flowers instantly',
    ],
    correctIndex: 1,
    didYouKnow:
      'Too much nitrogen may produce lush tender growth. Sap-sucking pests such as aphids often prefer soft new growth.',
  },
  {
    id: 'leaf-miners',
    question: 'What do leaf miners usually leave behind?',
    answers: [
      'Large slime trails',
      'Cottony white clumps',
      'Pale winding tunnels inside leaves',
      'Webs between stems',
    ],
    correctIndex: 2,
    didYouKnow:
      'Leaf miner larvae feed between leaf layers. Their trails often look like thin white lines across the leaf surface.',
  },
  {
    id: 'problem-notes',
    question: 'What is the best reason to keep notes about plant problems?',
    answers: [
      'To understand patterns and avoid repeating mistakes',
      'To make leaves grow square',
      'To stop seasons from changing',
      'To replace soil forever',
    ],
    correctIndex: 0,
    didYouKnow:
      'A plant journal helps connect symptoms with care actions so you can see what caused problems and what helped recovery.',
  },
  {
    id: 'slugs-snails',
    question: 'Which symptom is common with slugs and snails?',
    answers: [
      'Fine webbing on leaves',
      'Irregular holes and slime trails',
      'White cottony insects',
      'Tiny black flies above soil',
    ],
    correctIndex: 1,
    didYouKnow:
      'Slugs and snails are most active in damp conditions and often feed at night.',
  },
  {
    id: 'crop-rotation',
    question: 'Why is crop rotation useful in a vegetable garden?',
    answers: [
      'It helps reduce repeated pest and disease buildup in the same soil',
      'It makes plants grow without water',
      'It changes vegetables into flowers',
      'It removes the need for harvesting',
    ],
    correctIndex: 0,
    didYouKnow:
      'Growing the same plant family in the same place every season can allow specific pests and diseases to build up.',
  },
  {
    id: 'aphids-inspect',
    question: 'Which plant part should you inspect first for aphids?',
    answers: [
      'Old dry soil only',
      'The outside of the pot',
      'Tender new growth and leaf undersides',
      'The garden label',
    ],
    correctIndex: 2,
    didYouKnow:
      'Aphids often gather on soft new growth because it is easier to feed from. They can reproduce very quickly in warm conditions.',
  },
  {
    id: 'companion-planting',
    question: 'What does companion planting mean?',
    answers: [
      'Growing selected plants near each other for possible benefits',
      'Giving every plant a human name',
      'Planting only one crop forever',
      'Keeping plants away from all insects',
    ],
    correctIndex: 0,
    didYouKnow:
      'Some gardeners use companion planting to attract beneficial insects, confuse pests, improve space use, or support pollination.',
  },
  {
    id: 'winter-water',
    question: 'Why can indoor plants need less water in winter?',
    answers: [
      'Lower light and slower growth reduce water use',
      'Winter water is stronger',
      'Pots become waterproof',
      'Roots stop existing in winter',
    ],
    correctIndex: 0,
    didYouKnow:
      'When growth slows, many plants use water more slowly. A summer watering schedule can increase overwatering risk in winter.',
  },
  {
    id: 'cutworms',
    question: 'Which pest can cut young seedlings near the soil line?',
    answers: ['Whiteflies', 'Cutworms', 'Scale insects', 'Springtails'],
    correctIndex: 1,
    didYouKnow:
      'Cutworms often hide in the soil during the day and feed at night. Protective collars can help reduce damage.',
  },
  {
    id: 'rotate-indoor-pots',
    question: 'What is a good reason to rotate indoor pots occasionally?',
    answers: [
      'To help the plant receive light more evenly',
      'To confuse the plant completely',
      'To make soil disappear',
      'To stop roots from growing',
    ],
    correctIndex: 0,
    didYouKnow:
      'Many indoor plants lean toward the strongest light source. Rotating the pot can help growth stay balanced.',
  },
  {
    id: 'sooty-mold',
    question: 'What can black sooty mold on leaves be connected to?',
    answers: [
      'Honeydew from sap-sucking pests',
      'Too many flowers opening',
      'Roots growing too deeply',
      'Dry leaves becoming stronger',
    ],
    correctIndex: 0,
    didYouKnow:
      'Sooty mold grows on sticky honeydew, not directly from plant tissue. Controlling honeydew-producing pests usually helps.',
  },
  {
    id: 'new-plant',
    question: 'Which action is usually helpful after bringing home a new plant?',
    answers: [
      'Place it immediately among all other plants',
      'Fertilize it heavily on the first day',
      'Keep it isolated and inspect it for pests',
      'Remove all soil from the roots at once',
    ],
    correctIndex: 2,
    didYouKnow:
      'New plants can carry hidden pests or eggs. A short isolation period protects your existing plant collection.',
  },
  {
    id: 'airflow',
    question: 'Why is airflow important around plants?',
    answers: [
      'It helps reduce stagnant moisture and some disease risks',
      'It makes leaves change species',
      'It replaces all nutrients',
      'It stops the plant from needing soil',
    ],
    correctIndex: 0,
    didYouKnow:
      'Crowded plants with poor airflow can stay damp longer, which may encourage fungal problems and make pest inspection harder.',
  },
];

export const virtualPlants: VirtualPlant[] = [
  {id: 'apple-30', name: 'Apple Sprout', price: 30, imageKey: 'virtualPlant30'},
  {id: 'citrus-25', name: 'Citrus Pot', price: 25, imageKey: 'virtualPlant35a'},
  {id: 'berry-80', name: 'Berry Charm', price: 80, imageKey: 'virtualPlant35b'},
  {id: 'violet-40', name: 'Violet Bloom', price: 40, imageKey: 'virtualPlant40a'},
  {id: 'tomato-35', name: 'Tiny Tomato', price: 35, imageKey: 'virtualPlant40b'},
  {id: 'mint-60', name: 'Fresh Mint', price: 60, imageKey: 'virtualPlant50'},
  {id: 'rose-55', name: 'Patio Rose', price: 55, imageKey: 'virtualPlant55'},
  {id: 'fern-60', name: 'Soft Fern', price: 60, imageKey: 'virtualPlant60'},
  {id: 'rare-80', name: 'Rare Planter', price: 80, imageKey: 'virtualPlant80'},
];

export const gardenAreas = [
  {id: 'sunny', label: 'Sunny Corner', icon: '☀️'},
  {id: 'green', label: 'Green Nook', icon: '🌿'},
  {id: 'shade', label: 'Shaded Spot', icon: '🌑'},
] as const;
