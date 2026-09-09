// Stimuli list for FakeGen experiment
var stimuli_list = [
    // ── Faces ────────────────────────────────────────────────
    { "stimulus": "faces/017_03.jpg",  "Category": "Face" },
    { "stimulus": "faces/125_03.jpg",  "Category": "Face" },

    // ── Art ──────────────────────────────────────────────────
    { "stimulus": "art/10601.jpg",     "Category": "Art" },
    { "stimulus": "art/51204.jpg",     "Category": "Art" },

    // ── Chats ────────────────────────────────────────────────
    { "stimulus": "chats/101_intro.png", "Category": "Chat" },
    { "stimulus": "chats/202.png",       "Category": "Chat" },

    // ── Erotic ───────────────────────────────────────────────
    // SubCategory is used to filter stimuli based on participant demographics.
    // Values: "Female", "Male", "Opposite-sex Couple", "Female Couple", "Male Couple"
    { "stimulus": "erotic/Female_couple_012_v.jpg", "Category": "Erotic", "SubCategory": "Female Couple" },
    { "stimulus": "erotic/Male_couple_047_h.jpg",   "Category": "Erotic", "SubCategory": "Male Couple" },

    // ── Negative ────────────────────────────────────────────
    { "stimulus": "negative/Animals_001_h.JPG",  "Category": "Negative" },
    { "stimulus": "negative/People_217_h.JPG",  "Category": "Negative" },
]