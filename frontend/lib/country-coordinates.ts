export interface CountryCoordinates {
  [key: string]: [number, number]; // [longitude, latitude]
}

export const COUNTRY_COORDINATES: CountryCoordinates = {
  AF: [67.709953, 33.93911], // Afghanistan
  AL: [20.168331, 41.153332], // Albania
  DZ: [1.659626, 28.033886], // Algeria
  AS: [-170.132217, -14.270972], // American Samoa
  AD: [1.521801, 42.546245], // Andorra
  AO: [17.873887, -11.202692], // Angola
  AI: [-63.068615, 18.220554], // Anguilla
  AR: [-63.616672, -38.416097], // Argentina
  AM: [45.038189, 40.069099], // Armenia
  AW: [-69.968338, 12.52111], // Aruba
  AU: [133.775136, -25.274398], // Australia
  AZ: [47.576927, 40.143105], // Azerbaijan
  BS: [-77.39628, 25.03428], // Bahamas
  BH: [50.5577, 26.0667], // Bahrain
  BD: [90.356331, 23.684994], // Bangladesh
  BB: [-59.543198, 13.193887], // Barbados
  BY: [27.953389, 53.709807], // Belarus
  BE: [4.469936, 50.503887], // Belgium
  BZ: [-88.49765, 17.189877], // Belize
  BJ: [2.315834, 9.30769], // Benin
  BM: [-64.75737, 32.321384], // Bermuda
  BT: [90.433601, 27.514162], // Bhutan
  BO: [-63.588653, -16.290154], // Bolivia
  BA: [17.679076, 43.915886], // Bosnia and Herzegovina
  BW: [24.684866, -22.328474], // Botswana
  BR: [-53.2, -10.0], // Brazil (approximate center)
  VG: [-64.639968, 18.420695], // British Virgin Islands
  BN: [114.727669, 4.535277], // Brunei
  BG: [25.48583, 42.733883], // Bulgaria
  BF: [-1.561593, 12.238333], // Burkina Faso
  BI: [29.918886, -3.373056], // Burundi
  KH: [104.990963, 12.565679], // Cambodia
  CM: [12.354722, 7.369722], // Cameroon
  CA: [-106.346771, 56.130366], // Canada
  CV: [-23.605172, 16.002082], // Cape Verde
  KY: [-80.566956, 19.513469], // Cayman Islands
  CF: [20.939444, 6.611111], // Central African Republic
  TD: [18.732207, 15.454166], // Chad
  CL: [-71.542969, -35.675147], // Chile
  CN: [104.195397, 35.86166], // China
  CO: [-74.297333, 4.570868], // Colombia
  KM: [43.872219, -11.875001], // Comoros
  CK: [-159.777671, -21.236736], // Cook Islands
  CR: [-83.753428, 9.748917], // Costa Rica
  HR: [15.2, 45.1], // Croatia
  CU: [-77.781167, 21.521757], // Cuba
  CW: [-68.964, 12.1696], // Curacao
  CY: [33.429859, 35.126413], // Cyprus
  CZ: [15.472962, 49.817492], // Czech Republic
  CD: [21.758664, -4.038333], // Democratic Republic of the Congo
  DK: [9.501785, 56.26392], // Denmark
  DJ: [42.590275, 11.825138], // Djibouti
  DM: [-61.370976, 15.414999], // Dominica
  DO: [-70.162651, 18.735693], // Dominican Republic
  TL: [125.727539, -8.874217], // East Timor
  EC: [-78.183406, -1.831239], // Ecuador
  EG: [30.802498, 26.820553], // Egypt
  SV: [-88.89653, 13.794185], // El Salvador
  ER: [39.782334, 15.179384], // Eritrea
  EE: [25.013607, 58.595272], // Estonia
  ET: [40.489673, 9.145], // Ethiopia
  FO: [-6.911806, 61.892635], // Faroe Islands
  FJ: [178.065032, -17.713371], // Fiji
  FI: [25.748151, 61.92411], // Finland
  FR: [2.213749, 46.227638], // France
  PF: [-149.406843, -17.679742], // French Polynesia
  GA: [11.609444, -0.803689], // Gabon
  GM: [-15.310139, 13.443182], // Gambia
  GE: [43.356892, 42.315407], // Georgia
  DE: [10.451526, 51.165691], // Germany
  GH: [-1.023194, 7.946527], // Ghana
  GR: [21.824312, 39.074208], // Greece
  GL: [-42.604303, 71.706936], // Greenland
  GD: [-61.604171, 12.262776], // Grenada
  GU: [144.793731, 13.444304], // Guam
  GT: [-90.230759, 15.783471], // Guatemala
  GG: [-2.585278, 49.465691], // Guernsey
  GN: [-9.696645, 9.945587], // Guinea
  GW: [-15.180413, 12.238333], // Guinea-Bissau
  GY: [-58.93018, 4.860416], // Guyana
  HT: [-72.285215, 18.971187], // Haiti
  HN: [-86.241905, 15.199999], // Honduras
  HK: [114.109497, 22.396428], // Hong Kong
  HU: [19.503304, 47.162494], // Hungary
  IS: [-19.020835, 64.963051], // Iceland
  IN: [78.96288, 20.593684], // India
  ID: [113.921327, -0.789275], // Indonesia
  IR: [53.688046, 32.427908], // Iran
  IQ: [43.679291, 33.223191], // Iraq
  IE: [-8.24389, 53.41291], // Ireland
  IM: [-4.548056, 54.236107], // Isle of Man
  IL: [34.851612, 31.046051], // Israel
  IT: [12.56738, 41.87194], // Italy
  CI: [-5.54708, 7.539989], // Ivory Coast
  JM: [-77.297508, 18.109581], // Jamaica
  JP: [138.252924, 36.204824], // Japan
  JE: [-2.13125, 49.214439], // Jersey
  JO: [36.238414, 30.585164], // Jordan
  KZ: [66.923684, 48.019573], // Kazakhstan
  KE: [37.906193, -0.023559], // Kenya
  KI: [-157.363026, -3.370417], // Kiribati
  XK: [20.902977, 42.602636], // Kosovo
  KW: [47.481766, 29.31166], // Kuwait
  KG: [74.766098, 41.20438], // Kyrgyzstan
  LA: [102.495496, 19.85627], // Laos
  LV: [24.603189, 56.879635], // Latvia
  LB: [35.862285, 33.854721], // Lebanon
  LS: [28.233608, -29.609988], // Lesotho
  LR: [-9.429499, 6.428055], // Liberia
  LY: [17.228331, 26.3351], // Libya
  LI: [9.555373, 47.166], // Liechtenstein
  LT: [23.881275, 55.169438], // Lithuania
  LU: [6.129583, 49.815273], // Luxembourg
  MO: [113.543873, 22.198745], // Macau
  MK: [21.745275, 41.608635], // Macedonia
  MG: [46.869107, -18.766947], // Madagascar
  MW: [34.301525, -13.254308], // Malawi
  MY: [101.975766, 4.210484], // Malaysia
  MV: [73.22068, 3.202778], // Maldives
  ML: [-3.996166, 17.570692], // Mali
  MT: [14.375416, 35.937496], // Malta
  MH: [171.184478, 7.131474], // Marshall Islands
  MR: [-10.940835, 21.00789], // Mauritania
  MU: [57.552152, -20.348404], // Mauritius
  YT: [45.166244, -12.8275], // Mayotte
  MX: [-102.552784, 23.634501], // Mexico
  FM: [150.550812, 7.425554], // Micronesia
  MD: [28.369885, 47.411631], // Moldova
  MC: [7.412841, 43.750298], // Monaco
  MN: [103.846656, 46.862496], // Mongolia
  ME: [19.37439, 42.708678], // Montenegro
  MA: [-7.09262, 31.791702], // Morocco
  MZ: [35.529562, -18.665695], // Mozambique
  MM: [95.956223, 21.913965], // Myanmar
  NA: [17.209635, -22.95764], // Namibia
  NP: [84.124008, 28.394857], // Nepal
  NL: [5.291266, 52.132633], // Netherlands
  AN: [-69.060087, 12.226079], // Netherlands Antilles
  NC: [165.618042, -20.904305], // New Caledonia
  NZ: [174.885971, -40.900557], // New Zealand
  NI: [-85.207229, 12.865416], // Nicaragua
  NE: [8.081666, 17.607789], // Niger
  NG: [8.675277, 9.081999], // Nigeria
  KP: [127.510093, 40.339852], // North Korea
  MP: [145.6739, 15.0979], // Northern Mariana Islands
  NO: [8.468946, 60.472024], // Norway
  OM: [55.923255, 21.512583], // Oman
  PK: [69.345116, 30.375321], // Pakistan
  PS: [35.233154, 31.952162], // Palestine
  PA: [-80.782127, 8.537981], // Panama
  PG: [143.95555, -6.314993], // Papua New Guinea
  PY: [-58.443832, -23.442503], // Paraguay
  PE: [-75.015152, -9.189967], // Peru
  PH: [121.774017, 12.879721], // Philippines
  PL: [19.145136, 51.919438], // Poland
  PT: [-8.224454, 39.399872], // Portugal
  PR: [-66.590149, 18.220833], // Puerto Rico
  QA: [51.183884, 25.354826], // Qatar
  CG: [15.827659, -0.228021], // Republic of the Congo
  RE: [55.536384, -21.115141], // Reunion
  RO: [24.96676, 45.943161], // Romania
  RU: [105.318756, 61.52401], // Russia
  RW: [29.873888, -1.940278], // Rwanda
  KN: [-62.782998, 17.357822], // Saint Kitts and Nevis
  LC: [-60.978893, 13.909444], // Saint Lucia
  MF: [-63.0668, 18.0708], // Saint Martin
  PM: [-56.27111, 46.941936], // Saint Pierre and Miquelon
  VC: [-61.287228, 12.984305], // Saint Vincent and the Grenadines
  WS: [-172.104629, -13.759029], // Samoa
  SM: [12.457777, 43.94236], // San Marino
  ST: [6.613081, 0.18636], // Sao Tome and Principe
  SA: [45.079162, 23.885942], // Saudi Arabia
  SN: [-14.452362, 14.497401], // Senegal
  RS: [21.005859, 44.016521], // Serbia
  SC: [55.491977, -4.679574], // Seychelles
  SL: [-11.779889, 8.460555], // Sierra Leone
  SG: [103.819836, 1.352083], // Singapore
  SX: [-63.082466, 18.04248], // Sint Maarten
  SK: [19.699024, 48.669026], // Slovakia
  SI: [14.995463, 46.151241], // Slovenia
  SB: [160.156194, -9.64571], // Solomon Islands
  SO: [46.199616, 5.152149], // Somalia
  ZA: [22.937506, -30.559482], // South Africa
  KR: [127.766922, 35.907757], // South Korea
  SS: [31.306978, 6.876992], // South Sudan
  ES: [-3.74922, 40.463667], // Spain
  LK: [80.771797, 7.873054], // Sri Lanka
  SD: [30.217636, 12.862807], // Sudan
  SR: [-56.027783, 3.919305], // Suriname
  SZ: [31.465866, -26.522503], // Swaziland
  SE: [18.643501, 60.128161], // Sweden
  CH: [8.227512, 46.818188], // Switzerland
  SY: [38.996815, 34.802075], // Syria
  TW: [120.960515, 23.69781], // Taiwan
  TJ: [71.276093, 38.861034], // Tajikistan
  TZ: [34.888822, -6.369028], // Tanzania
  TH: [100.992541, 15.870032], // Thailand
  TG: [0.824782, 8.619543], // Togo
  TO: [-175.198242, -21.178986], // Tonga
  TT: [-61.222503, 10.691803], // Trinidad and Tobago
  TN: [9.537499, 33.886917], // Tunisia
  TR: [35.243322, 38.963745], // Turkey
  TM: [59.556278, 38.969719], // Turkmenistan
  TC: [-71.797928, 21.694025], // Turks and Caicos Islands
  TV: [177.64933, -7.109535], // Tuvalu
  VI: [-64.896335, 18.335765], // U.S. Virgin Islands
  UG: [32.290275, 1.373333], // Uganda
  UA: [31.16558, 48.379433], // Ukraine
  AE: [53.847818, 23.424076], // United Arab Emirates
  GB: [-3.435973, 55.378051], // United Kingdom
  US: [-95.712891, 37.09024], // United States
  UY: [-55.765835, -32.522779], // Uruguay
  UZ: [64.585262, 41.377491], // Uzbekistan
  VU: [166.959158, -15.376706], // Vanuatu
  VE: [-66.58973, 6.42375], // Venezuela
  VN: [108.277199, 14.058324], // Vietnam
  EH: [-12.885834, 24.215527], // Western Sahara
  YE: [48.516388, 15.552727], // Yemen
  ZM: [27.849332, -13.133897], // Zambia
  ZW: [29.154857, -19.015438], // Zimbabwe
};