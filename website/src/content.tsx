import type { ReactNode } from 'react';
import { DOWNLOAD_URL, GITHUB_URL, RELEASE_URL, RELEASE_VERSION } from './release';

const releaseDocs = `${GITHUB_URL}/blob/v${RELEASE_VERSION}/docs`;

export type ContentPage = {
  path: string;
  title: string;
  description: string;
  heading: string;
  intro: string;
  updated: string;
  content: ReactNode;
  related: string[];
};

export const contentPages: ContentPage[] = [
  {
    path: '/download',
    title: 'Download Estera for Mac — Free iPhone Location Simulator',
    description: 'Download the free Estera Mac preview for Apple Silicon and macOS 15+. Read USB requirements, installation steps, signing details, and current limitations.',
    heading: 'Download Estera for Mac',
    intro: `Estera ${RELEASE_VERSION} is a free, open-source desktop preview for planning pins and simulated iPhone journeys from your Mac.`,
    updated: '2026-10-20',
    related: ['/compatibility', '/guides/iphone-location-simulation', '/privacy'],
    content: <>
      <h2>One app. Every included feature. $0.</h2>
      <p>Pin, Walk, Bike, Drive, route preview, saved journeys, and GPX import/export are included. There is no subscription, paid Pro tier, account requirement, or GitHub-star requirement. Estera is open source under GPL-3.0-or-later.</p>
      <h2>Before you download</h2>
      <ul>
        <li><strong>Mac:</strong> Apple Silicon running macOS 15 or later. This download is not for Intel Macs.</li>
        <li><strong>iPhone target:</strong> iOS 17.4 or later, with Trust, Developer Mode, and developer-service setup as required.</li>
        <li><strong>Connection:</strong> a USB data cable, kept connected throughout the session. Wireless connections are not offered.</li>
        <li><strong>Internet:</strong> needed for maps, place search, directions, and initial developer-file preparation.</li>
      </ul>
      <p><strong>This is a preview:</strong> the app is locally ad-hoc signed, not Developer ID signed or notarized by Apple. Physical iPhone location set/reset and clean-machine installation remain unverified. Version targets do not guarantee a particular Mac and iPhone combination; read the <a href="/compatibility">compatibility and evidence details</a>.</p>
      <p><a className="button button-primary" href={DOWNLOAD_URL} data-download="mac">Download Estera {RELEASE_VERSION} for Mac</a></p>
      <p>The download is <strong>Estera-{RELEASE_VERSION}-macos-arm64.zip</strong>, hosted on GitHub. Review the <a href={RELEASE_URL}>version {RELEASE_VERSION} release notes and assets</a> before installing.</p>
      <h2>Install and open</h2>
      <ol>
        <li>Unzip the download and move <strong>Estera.app</strong> into <strong>Applications</strong>.</li>
        <li>Open Estera. If macOS blocks the preview, review the release first. If you trust the download, use <strong>System Settings → Privacy &amp; Security → Open Anyway</strong>. Keep Gatekeeper enabled.</li>
        <li>Connect and unlock your iPhone. Choose <strong>Set up my iPhone</strong> for guided setup, or <strong>Developer Mode is already on — connect</strong> if it is already enabled.</li>
        <li>Select the intended phone, authorize its connection, and complete the remaining steps before using the location controls.</li>
      </ol>
      <p>The Mac download bundles its runtime and interface. You do not need Node.js, Python, Homebrew, or a terminal to use it. No location command is sent until you explicitly set a location or start a route. Follow the <a href="/guides/iphone-location-simulation">first-session guide</a> for choosing a place and stopping a session.</p>
      <h2>Updates and other platforms</h2>
      <p>There is no automatic updater. Download and install later releases manually from GitHub. Windows is a source preview, with no Windows installer or native Windows/iPhone validation. Intel Mac packages are not available.</p>
      <p>For source builds and troubleshooting, see the <a href={`${releaseDocs}/DESKTOP.md`}>desktop installation guide</a>, <a href={`${releaseDocs}/DISTRIBUTION.md`}>packaging and license details</a>, and <a href={`${releaseDocs}/WINDOWS.md`}>Windows source instructions</a>.</p>
    </>,
  },
  {
    path: '/guides/iphone-location-simulation',
    title: 'iPhone Location Simulation Guide for Mac | Estera',
    description: 'Follow Estera’s USB setup, choose a pin, understand preview versus device actions, and use Stop/reset. Includes Mac preview compatibility and reset limitations.',
    heading: 'Your first iPhone location simulation',
    intro: 'Connect the intended phone, choose a place, then explicitly start the simulation. This guide describes the Mac preview workflow; physical iPhone set/reset remains unverified.',
    updated: '2026-10-20',
    related: ['/download', '/guides/routes-and-gpx', '/compatibility'],
    content: <>
      <h2>Start with a compatible setup</h2>
      <p>The packaged preview targets Apple Silicon Macs on macOS 15 or later and iPhone USB developer services on iOS 17.4 or later. Keep a USB data cable connected for the entire session. Check the <a href="/compatibility">compatibility page</a> before installing; these are implementation targets, not verified hardware combinations.</p>
      <p>Use the <a href="/download">free Mac download</a> and open Estera from Applications. The website’s globe and route demonstration run in your browser and cannot control a phone. Device actions belong to the local desktop app.</p>
      <h2>Connect and authorize your iPhone</h2>
      <ol>
        <li>Connect the USB data cable and unlock your iPhone.</li>
        <li>Select <strong>Set up my iPhone</strong>, then find and select the intended device. If Developer Mode is already enabled, use <strong>Developer Mode is already on — connect</strong>.</li>
        <li>Authorize the selected phone and follow any Trust, Developer Mode, restart, and developer-file preparation steps the app presents.</li>
        <li>Keep the phone connected and your Mac awake while using the session.</li>
      </ol>
      <p>Developer Mode requires decisions on the iPhone; use a device you own or have permission to test. Initial developer-file preparation can use the internet. USB setup does not enable wireless access or change existing wireless pairings.</p>
      <h2>Choose a single location</h2>
      <p>Select <strong>Pin</strong>, then search for an address, city, or postal code, or choose a point on the map. Add the city and country when a name is ambiguous. Results show geographic context so you can distinguish similarly named places.</p>
      <p>Choose <strong>Use this location</strong> for the desired point. The explicit <strong>Set phone location</strong> action sends the location command to the selected phone. Searching, looking around the map, or selecting a pin does not by itself start a simulation.</p>
      <p>A dropped pin keeps its chosen coordinates even when its address label comes from the nearest known address. Map coverage may be incomplete. Location simulation changes coordinates; it does not change the phone’s IP address.</p>
      <h2>Preview a journey before starting it</h2>
      <p>Walk, Bike, and Drive add a route between stops. <strong>Preview route</strong> moves the map marker only. The separate <strong>Start drive/ride/walk on iPhone</strong> action sends the journey to the phone. See the <a href="/guides/routes-and-gpx">routes and GPX guide</a> for pace, stop settings, and imported tracks.</p>
      <h2>Stop and reset</h2>
      <p>Use <strong>Stop &amp; reset</strong> before quitting when possible. It stops updates and asks the developer service to clear simulation. A successful command acknowledgment does not independently confirm what another iPhone app sees or that the phone has recovered its physical location.</p>
      <p>If the cable disconnects, reconnect the same phone, retry the connection, and reset. Closing the Mac app’s last window or quitting attempts cleanup, but an unreachable phone cannot confirm reset. When using the source version in a browser, closing the tab leaves its local server running; follow the <a href={`${releaseDocs}/WEB_BETA.md`}>local app shutdown instructions</a>.</p>
      <p>The <a href={`${releaseDocs}/DESKTOP.md`}>desktop guide</a> documents setup and port conflicts. The <a href={`${releaseDocs}/STATUS.md`}>release evidence</a> distinguishes software checks from the physical-device work still needed.</p>
    </>,
  },
  {
    path: '/guides/routes-and-gpx',
    title: 'Plan Routes and Import GPX Tracks | Estera Guide',
    description: 'Plan walking, cycling, and driving routes in Estera. Learn route preview, stops, saved journeys, GPX limits, recorded timing, and what the simulation can show.',
    heading: 'Plan a route. Keep the journey.',
    intro: 'Use Walk, Bike, or Drive to build a journey between stops, preview it on the map, and save its settings. GPX lets you bring in a recorded track or export route geometry.',
    updated: '2026-10-20',
    related: ['/guides/iphone-location-simulation', '/download', '/privacy'],
    content: <>
      <h2>Build a route between places</h2>
      <ol>
        <li>Select <strong>Walk</strong>, <strong>Bike</strong>, or <strong>Drive</strong>.</li>
        <li>Choose a starting point and destination on the map or through place search. Add intermediate stops when needed.</li>
        <li>Set stop pauses beneath each address, then select <strong>Find route</strong>.</li>
        <li>Review the route and its pace before selecting <strong>Preview route</strong>.</li>
      </ol>
      <p>Drag a pin to adjust a stop, or select its address to search for a replacement. Reversing stops recalculates directions, including one-way roads. <strong>Make a round trip</strong> requests a road route back to the start.</p>
      <p>Online route requests allow up to 25 stops, 500 km in total, and 50,000 geometry points. Split longer journeys. Directions depend on the selected mode and available provider data; an unavailable route does not become an invented straight line.</p>
      <h2>Understand preview and phone playback</h2>
      <p><strong>Preview route</strong> moves the map marker. It defaults to real time; optional 5× and 10× rates affect the preview only. <strong>Start drive/ride/walk on iPhone</strong> is a separate, explicit device action requiring the selected phone’s USB connection.</p>
      <p>The playback bar provides pause, resume, and <strong>Stop &amp; reset</strong>. Editing is locked during an active session. Under <strong>Trip options</strong>, choose a timer, destination stay/reset behavior, or repeats. Repeats require a closed route. Follow the <a href="/guides/iphone-location-simulation">connection and reset guide</a>; physical iPhone playback and reset remain unverified.</p>
      <h2>What driving simulates</h2>
      <p>Driving follows provider road geometry with acceleration, braking, and simulated waits. Available road data informs the pace, but the app does not observe live traffic lights or guarantee complete posted speed limits. Walking and cycling use routes appropriate to those modes.</p>
      <p>Driving begins on the road near the start. With <strong>Walk to this stop</strong> enabled, the car stops by a nearby drivable road and the journey continues to the destination pin on foot. Mapped walking paths and estimated approaches are shown differently. Turn this option off to remain by the road.</p>
      <h2>Import and export GPX</h2>
      <p>Open <strong>Trip options</strong> for GPX import/export. Imports are limited to 5 MiB and 50,000 points and require segment selection. Recorded timestamps are supported when valid. Inspect an imported track before starting it: recorded geometry may leave roads or reflect a different travel mode.</p>
      <p>Use road recalculation when your intended journey should follow roads. Exporting GPX preserves geometry and timestamps. Save a journey inside Estera when you also want to keep its pace and stop settings; GPX does not encode every app setting.</p>
      <h2>Saved locally, with online map services</h2>
      <p>Saved places, routes, and history remain on your computer. Maps, search, and directions use external providers and can be incomplete or unavailable. The <a href="/privacy">privacy page</a> explains which requests leave your computer.</p>
      <p>For detailed behavior, see the <a href={`${releaseDocs}/WEB_BETA.md`}>local app guide</a> and <a href={`${releaseDocs}/DRIVING_MODEL.md`}>driving and timing model</a>. All of these tools are included in the <a href="/download">free Mac preview</a>.</p>
    </>,
  },
  {
    path: '/compatibility',
    title: 'Mac and iPhone Compatibility — Preview Status | Estera',
    description: 'Estera targets Apple Silicon, macOS 15+, and iOS 17.4+ over USB. See hardware verification limits, Windows source status, signing, and reset behavior.',
    heading: 'Compatibility and preview status',
    intro: `Estera ${RELEASE_VERSION} targets Apple Silicon Macs and an iPhone connected over USB. These targets describe the implementation; physical location set/reset has not been verified for this desktop preview.`,
    updated: '2026-10-20',
    related: ['/download', '/guides/iphone-location-simulation', '/guides/routes-and-gpx'],
    content: <>
      <h2>Mac and iPhone requirements</h2>
      <ul>
        <li><strong>Packaged Mac app:</strong> Apple Silicon, macOS 15 or later.</li>
        <li><strong>iPhone developer services:</strong> iOS 17.4 or later. iOS 17.0–17.3 is outside the USB target because the required USB proxy is unavailable.</li>
        <li><strong>Connection:</strong> USB only. Keep a data cable connected throughout setup and playback.</li>
        <li><strong>Setup:</strong> unlock the selected phone and complete Trust, Developer Mode, and any developer-file preparation.</li>
      </ul>
      <p>Wi-Fi, VPN, cellular, and Bluetooth phone connections are not offered. Older saved Auto preferences use USB without wireless fallback. Existing wireless settings and pairings are left unchanged.</p>
      <h2>What the release evidence establishes</h2>
      <p>The documented Mac bundle was built, its local signature was checked, and its native window displayed the USB connection screen. The project also records focused software checks for connection policy, authorization, and process cleanup.</p>
      <p><strong>There are no hardware-verified location set/reset combinations for this desktop preview.</strong> A build, an animated route marker, or an accepted developer-service command is not independent observation of an iPhone’s location. Clean-machine installation is also unverified.</p>
      <p>Read the <a href={`${releaseDocs}/STATUS.md`}>version-specific status report</a> for the scope and dates of recorded checks. The date on this page describes its content update, not a new hardware test.</p>
      <h2>Signing and installation</h2>
      <p>The preview is locally ad-hoc signed. It is not Developer ID signed or notarized by Apple. macOS may require <strong>Open Anyway</strong> approval after you review and trust the release. Keep Gatekeeper enabled. The <a href="/download">download page</a> includes the installation steps and the exact release archive.</p>
      <h2>Intel Mac and Windows</h2>
      <p>There is no Intel Mac or universal Mac package. Windows remains a source preview targeting Windows 10 22H2 and Windows 11 on Intel/AMD x64. There is no Windows installer, bundled runtime, dedicated native window, or native Windows/iPhone validation.</p>
      <p>Windows ARM, x64 emulation on ARM, and 32-bit Windows are outside that preview. Developers can consult the <a href={`${releaseDocs}/WINDOWS.md`}>Windows source instructions and pending checks</a>.</p>
      <h2>Reset and route limitations</h2>
      <p><strong>Stop &amp; reset</strong> sends a clear request through the developer service. An acknowledgment does not independently confirm physical-location recovery. If the phone becomes unreachable, reconnect the same device and retry reset. Quitting attempts cleanup but cannot confirm a reset on an unavailable phone.</p>
      <p>Maps, search, directions, and initial developer-file setup need internet. Public providers have capacity limits. Route pace and intersection waits are simulated; live signal states and complete road speed limits are not guaranteed.</p>
      <p>The <a href={`${releaseDocs}/COMPATIBILITY.md`}>hardware acceptance checklist</a> describes what to observe with an authorized phone. If reporting a problem through the <a href={`${GITHUB_URL}/issues`}>project’s GitHub issues</a>, include the app version and operating-system versions, and keep device identifiers, pairing records, and private route history out of a public report.</p>
    </>,
  },
  {
    path: '/privacy',
    title: 'Website and Desktop App Privacy | Estera',
    description: 'Understand Estera’s browser demo, optional analytics, local saved journeys, USB device control, and requests to map and developer-file providers.',
    heading: 'Privacy, on the website and in the app',
    intro: 'The public website is a demo and download site. The desktop app runs device control locally, while maps, place search, directions, and developer-file setup can contact external services.',
    updated: '2026-10-20',
    related: ['/download', '/guides/routes-and-gpx', '/compatibility'],
    content: <>
      <h2>The website demo</h2>
      <p>The globe and route preview illustrate the interface in your browser. They do not request your geolocation, connect to an iPhone, or change a device’s location. The public website contains no phone-control backend and requires no account.</p>
      <p>Loading this site sends ordinary web requests to its hosting provider. Download and repository links lead to GitHub, which receives requests when you follow them. Those services operate separately from the local desktop app; this page does not promise that hosting or download providers keep no access logs.</p>
      <h2>Optional website analytics</h2>
      <p>Optional Google Analytics is disabled unless the site operator configures it and you explicitly opt in. Without both conditions, the website does not load the Google Analytics script. Your analytics preference is stored in this browser’s local storage.</p>
      <p>If enabled with your consent, measurement covers page views using canonical page paths and clicks on download links. A download click does not establish that a download or installation completed. The site does not add search queries, free-form text, phone identifiers, or route data to these events, and advertising features are disabled. You can change your choice using the analytics controls on this page.</p>
      <h2>What the desktop app stores locally</h2>
      <p>Saved places, journeys, and history are stored on your computer. Interface and setup preferences also use local storage. The Mac content store is under <strong>Library/Application Support/OpenLocation</strong> in your user folder; the Windows source preview uses <strong>%LOCALAPPDATA%\OpenLocation</strong>.</p>
      <p>Developer files and pairing records are kept outside the application bundle. Pairing records are not part of saved journeys. Exporting or sharing a GPX file exposes the locations and timestamps it contains to its recipient.</p>
      <h2>Desktop requests that use the internet</h2>
      <ul>
        <li><strong>OpenFreeMap:</strong> map tiles and map assets.</li>
        <li><strong>Photon:</strong> typed place-search text for suggestions.</li>
        <li><strong>Nominatim:</strong> submitted place searches and selected coordinates for address lookup.</li>
        <li><strong>Valhalla:</strong> routing stops and travel mode for directions.</li>
        <li><strong>Developer-file preparation:</strong> developer-image downloads from GitHub-hosted sources and personalization requests to Apple when required by setup.</li>
      </ul>
      <p>These services receive the requests needed for their work and are subject to their own policies. A local control connection does not make maps or search offline. The desktop app has no account system or built-in analytics in the documented preview.</p>
      <h2>Device control and public reports</h2>
      <p>Phone control runs on your computer and uses USB with explicit authorization for the selected device. A location is sent only when you explicitly set a location or start a journey. See <a href="/guides/iphone-location-simulation">the connection guide</a> for session controls and reset limitations.</p>
      <p>For implementation details, consult the <a href={`${releaseDocs}/WEB_BETA.md`}>local app guide</a> and <a href={`${releaseDocs}/DISTRIBUTION.md`}>storage and distribution notes</a>. If you <a href={`${GITHUB_URL}/issues`}>report an issue on GitHub</a>, omit pairing records, full device identifiers, and private locations from public reports.</p>
    </>,
  },
];
