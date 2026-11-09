Add-Type -AssemblyName System.Speech

$narrations = @(
    @{ id = "vo_1"; text = "Flashcards on a phone isolate information in a flat two-D list, ignoring how our spatial memory evolved. Welcome to Loci Lens, an augmented reality memory palace engineered specifically for Snap SPECS glasses." },
    @{ id = "vo_2"; text = "We planned Loci Lens with the official Devpost Learn skill pack, producing our design brief. We adhere strictly to Snap's core design rules: drawing in the world, leaving your body free, and keeping secondary interfaces glanceable." },
    @{ id = "vo_3"; text = "In Lens Studio's Interactive Preview, we begin in Place mode. We associate our learning cards with physical locations in the room. We pin photosynthesis to our desk lamp, Planck's constant by the charger, Augustus at the doorway, Olympus Mons on the bookshelf, Benzene on the coffee table, and an AVL tree on the window sill. Notice how the peripheral HUD at the bottom right tracks our progress at the optical margin." },
    @{ id = "vo_4"; text = "Next, in Stroll mode, we walk freely through our room. Each locus marker presents a subtle mnemonic icon. As we approach within one point five meters, the concept expands. If a locus falls outside our field of view, a gentle directional chevron guides us along our memory path without obstructing central vision." },
    @{ id = "vo_5"; text = "Now the core experience: Test mode. All answers are strictly hidden. We navigate to each locus and read the recall prompt. An intentional pinch flips the card to reveal the answer. We mark Got It or Missed, updating our Leitner three-box spaced repetition store." },
    @{ id = "vo_6"; text = "Once all cards are tested, the Summary screen displays our retention score and Leitner box assignments. With a single pinch on Review Missed, we can instantly launch a targeted remediation loop on our missed items." },
    @{ id = "vo_7"; text = "Loci Lens combines cognitive science, the Spectacles Interaction Kit, and closed-loop agentic development to make learning embodied and unforgettable. All automated tests pass with one hundred percent coverage. Thank you." }
)

foreach ($item in $narrations) {
    $synth = New-Object System.Speech.Synthesis.SpeechSynthesizer
    $synth.Rate = 0  # Normal speed
    $outPath = Join-Path "temp_audio" "$($item.id).wav"
    $synth.SetOutputToWaveFile($outPath)
    $synth.Speak($item.text)
    $synth.Dispose()
    Write-Host "Generated $($item.id).wav"
}
