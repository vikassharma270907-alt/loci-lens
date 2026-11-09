Add-Type -AssemblyName System.Speech

$audioDir = "temp_audio"
if (-not (Test-Path $audioDir)) {
    New-Item -ItemType Directory -Path $audioDir | Out-Null
}

$narrations = @(
    @{ 
        id = "torquelock_vo_1"; 
        text = "In industrial piping, improper bolt tightening causes catastrophic gasket blowout and plant downtime. Technicians must memorize the cross-pattern star sequence required by ASME PCC-1. But circular flanges lack visual landmarks, causing workers to lose their place. Welcome to TorqueLock AR on Snap SPECS. TorqueLock transforms the physical six-bolt flange itself into a spatial memory palace." 
    },
    @{ 
        id = "torquelock_vo_2"; 
        text = "Planned with the Devpost Learn skill pack, TorqueLock AR grounds every design decision in cognitive science. Based on Krokos et al. and Moll and Sykes on virtual memory palaces, the six physical bolt positions serve as real-world loci. Following Henderson and Feiner and Lindlbauer, our cognitive Focus Mode dynamically collapses floating specification tags into minimal eyes-up status indicators during tool engagement." 
    },
    @{ 
        id = "torquelock_vo_3"; 
        text = "In Learn mode, technicians encode the star sequence: Bolt 1 at top dead center, followed by its polar opposite Bolt 4, shifting to Bolt 2, across to Bolt 5, then Bolt 3, and closing on Bolt 6. High-luminance cyan guidance rings and spatial beacons direct visual attention without optical washout, anchoring an intuitive procedural cue directly to each fastener." 
    },
    @{ 
        id = "torquelock_vo_4"; 
        text = "Next, Recall mode removes the visual crutches. Guidance lines disappear, challenging spatial recall. The technician pinches the active bolt to confirm their procedural choice. Immediate spatial feedback validates correct retrieval, reinforcing memory pathways before live wrenching." 
    },
    @{ 
        id = "torquelock_vo_5"; 
        text = "In Practise mode, technicians execute the full ASME PCC-1 multi-pass torque ramp: Pass 1 at 35 Newton-meters, Pass 2 at 70, and Pass 3 at 100. Focus Mode streamlines the display: Pass 1, Bolt 1, 35 Newton-meters. If a technician tightens in an improper circle, our engine detects asymmetric stress, flashing an alert for 1.8 millimeters of gasket warp before catastrophic leakage occurs." 
    },
    @{ 
        id = "torquelock_vo_6"; 
        text = "Upon completion, the Summary dashboard displays tightening accuracy, sequence efficiency, and Leitner three-box spaced repetition tracking. Any missed bolts are routed into Box 1 for targeted re-training, ensuring mastery before field deployment." 
    },
    @{ 
        id = "torquelock_vo_7"; 
        text = "TorqueLock AR is built on a decoupled TypeScript state machine verified with twenty passing automated LEAF scenarios. Transparent disclaimers clarify this is an educational simulation. TorqueLock AR: transforming industrial maintenance through spatial memory and intelligent augmented reality." 
    }
)

foreach ($item in $narrations) {
    $synth = New-Object System.Speech.Synthesis.SpeechSynthesizer
    $synth.Rate = 2  # Confident, crisp presenter pace
    $outPath = Join-Path $audioDir "$($item.id).wav"
    $synth.SetOutputToWaveFile($outPath)
    $synth.Speak($item.text)
    $synth.Dispose()
    Write-Host "Generated $($item.id).wav"
}

Write-Host "All streamlined TorqueLock AR voiceovers generated successfully."
