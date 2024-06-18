import Toast from 'react-native-toast-message';
import {environment} from '../environments/environment';
import {getData} from '../api/networkServices';

export const showToast = (type, title, msg) => {
  Toast.show({
    type: type,
    text1: title,
    text2: msg,
    swipeable: true,
  });
};

export const calRewardPntsAndProgress = (user, reward) => {
  const currPnts = user?.current_point;
  const rewardPnts = reward?.reward_points;

  const progress =
    parseFloat(currPnts / rewardPnts).toFixed(2) > 1
      ? 1
      : parseFloat(currPnts / rewardPnts).toFixed(2);

  return {
    currPnts,
    progress,
  };
};

export function calculateDistance(lat1, lon1, lat2, lon2, unit = 'km') {
  const theta = lon1 - lon2;
  let dist =
    Math.sin(deg2rad(lat1)) * Math.sin(deg2rad(lat2)) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.cos(deg2rad(theta));

  dist = Math.acos(dist);
  dist = rad2deg(dist);

  const miles = dist * 60 * 1.1515;

  switch (unit) {
    case 'km':
      return miles * 1.609344; // Kilometers
    case 'miles':
      return miles; // Miles
    case 'nautical_miles':
      return miles * 0.8684; // Nautical miles
    default:
      return miles;
  }
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

function rad2deg(rad) {
  return rad * (180 / Math.PI);
}

export const countryData = [
  {
    name: 'United Kingdom',
    phoneCode: '+44',
    countryCode: 'GB',
  },
  {
    name: 'Ascension Island',
    phoneCode: '+247',
    countryCode: 'AC',
  },
  {
    name: 'Andorra',
    phoneCode: '+376',
    countryCode: 'AD',
  },
  {
    name: 'United Arab Emirates',
    phoneCode: '+971',
    countryCode: 'AE',
  },
  {
    name: 'Afghanistan',
    phoneCode: '+93',
    countryCode: 'AF',
  },
  {
    name: 'Antigua And Barbuda',
    phoneCode: '+1 268',
    countryCode: 'AG',
  },
  {
    name: 'Anguilla',
    phoneCode: '+1 264',
    countryCode: 'AI',
  },
  {
    name: 'French Afar and Issas',
    countryCode: 'AI',
  },
  {
    name: 'Albania',
    phoneCode: '+355',
    countryCode: 'AL',
  },
  {
    name: 'Armenia',
    phoneCode: '+374',
    countryCode: 'AM',
  },
  {
    name: 'Netherlands Antilles',
    countryCode: 'AN',
  },
  {
    name: 'Angola',
    phoneCode: '+244',
    countryCode: 'AO',
  },
  {
    name: 'Antarctica',
    phoneCode: '+672',
    countryCode: 'AQ',
  },
  {
    name: 'Argentina',
    phoneCode: '+54',
    countryCode: 'AR',
  },
  {
    name: 'American Samoa',
    phoneCode: '+1 684',
    countryCode: 'AS',
  },
  {
    name: 'Austria',
    phoneCode: '+43',
    countryCode: 'AT',
  },
  {
    name: 'Australia',
    phoneCode: '+61',
    countryCode: 'AU',
  },
  {
    name: 'Aruba',
    phoneCode: '+297',
    countryCode: 'AW',
  },
  {
    name: 'Åland Islands',
    phoneCode: '+358',
    countryCode: 'AX',
  },
  {
    name: 'Azerbaijan',
    phoneCode: '+994',
    countryCode: 'AZ',
  },
  {
    name: 'Bosnia & Herzegovina',
    phoneCode: '+387',
    countryCode: 'BA',
  },
  {
    name: 'Barbados',
    phoneCode: '+1 246',
    countryCode: 'BB',
  },
  {
    name: 'Bangladesh',
    phoneCode: '+880',
    countryCode: 'BD',
  },
  {
    name: 'Belgium',
    phoneCode: '+32',
    countryCode: 'BE',
  },
  {
    name: 'Burkina Faso',
    phoneCode: '+226',
    countryCode: 'BF',
  },
  {
    name: 'Bulgaria',
    phoneCode: '+359',
    countryCode: 'BG',
  },
  {
    name: 'Bahrain',
    phoneCode: '+973',
    countryCode: 'BH',
  },
  {
    name: 'Burundi',
    phoneCode: '+257',
    countryCode: 'BI',
  },
  {
    name: 'Benin',
    phoneCode: '+229',
    countryCode: 'BJ',
  },
  {
    name: 'Saint Barthélemy',
    phoneCode: '+590',
    countryCode: 'BL',
  },
  {
    name: 'Bermuda',
    phoneCode: '+1 441',
    countryCode: 'BM',
  },
  {
    name: 'Brunei Darussalam',
    phoneCode: '+673',
    countryCode: 'BN',
  },
  {
    name: 'Bolivia, Plurinational State Of',
    phoneCode: '+591',
    countryCode: 'BO',
  },
  {
    name: 'Bonaire, Saint Eustatius And Saba',
    phoneCode: '+599',
    countryCode: 'BQ',
  },
  {
    name: 'British Antarctic Territory',
    countryCode: 'BQ',
  },
  {
    name: 'Brazil',
    phoneCode: '+55',
    countryCode: 'BR',
  },
  {
    name: 'Bahamas',
    phoneCode: '+1 242',
    countryCode: 'BS',
  },
  {
    name: 'Bhutan',
    phoneCode: '+975',
    countryCode: 'BT',
  },
  {
    name: 'Burma',
    countryCode: 'BU',
  },
  {
    name: 'Bouvet Island',
    countryCode: 'BV',
  },
  {
    name: 'Botswana',
    phoneCode: '+267',
    countryCode: 'BW',
  },
  {
    name: 'Belarus',
    phoneCode: '+375',
    countryCode: 'BY',
  },
  {
    name: 'Byelorussian SSR',
    countryCode: 'BY',
  },
  {
    name: 'Belize',
    phoneCode: '+501',
    countryCode: 'BZ',
  },
  {
    name: 'Canada',
    phoneCode: '+1',
    countryCode: 'CA',
  },
  {
    name: 'Cocos (Keeling) Islands',
    phoneCode: '+61',
    countryCode: 'CC',
  },
  {
    name: 'Democratic Republic Of Congo',
    phoneCode: '+243',
    countryCode: 'CD',
  },
  {
    name: 'Central African Republic',
    phoneCode: '+236',
    countryCode: 'CF',
  },
  {
    name: 'Republic Of Congo',
    phoneCode: '+242',
    countryCode: 'CG',
  },
  {
    name: 'Switzerland',
    phoneCode: '+41',
    countryCode: 'CH',
  },
  {
    name: "Côte d'Ivoire",
    phoneCode: '+225',
    countryCode: 'CI',
  },
  {
    name: 'Cook Islands',
    phoneCode: '+682',
    countryCode: 'CK',
  },
  {
    name: 'Chile',
    phoneCode: '+56',
    countryCode: 'CL',
  },
  {
    name: 'Cameroon',
    phoneCode: '+237',
    countryCode: 'CM',
  },
  {
    name: 'China',
    phoneCode: '+86',
    countryCode: 'CN',
  },
  {
    name: 'Colombia',
    phoneCode: '+57',
    countryCode: 'CO',
  },
  {
    name: 'Clipperton Island',
    countryCode: 'CP',
  },
  {
    name: 'Costa Rica',
    phoneCode: '+506',
    countryCode: 'CR',
  },
  {
    name: 'Czechoslovakia',
    countryCode: 'CS',
  },
  {
    name: 'Serbia and Montenegro',
    countryCode: 'CS',
  },
  {
    name: 'Canton and Enderbury Islands',
    countryCode: 'CT',
  },
  {
    name: 'Cuba',
    phoneCode: '+53',
    countryCode: 'CU',
  },
  {
    name: 'Cabo Verde',
    phoneCode: '+238',
    countryCode: 'CV',
  },
  {
    name: 'Curacao',
    phoneCode: '+599',
    countryCode: 'CW',
  },
  {
    name: 'Christmas Island',
    phoneCode: '+61',
    countryCode: 'CX',
  },
  {
    name: 'Cyprus',
    phoneCode: '+357',
    countryCode: 'CY',
  },
  {
    name: 'Czech Republic',
    phoneCode: '+420',
    countryCode: 'CZ',
  },
  {
    name: 'German Democratic Republic',
    countryCode: 'DD',
  },
  {
    name: 'Germany',
    phoneCode: '+49',
    countryCode: 'DE',
  },
  {
    name: 'Diego Garcia',
    countryCode: 'DG',
  },
  {
    name: 'Djibouti',
    phoneCode: '+253',
    countryCode: 'DJ',
  },
  {
    name: 'Denmark',
    phoneCode: '+45',
    countryCode: 'DK',
  },
  {
    name: 'Dominica',
    phoneCode: '+1 767',
    countryCode: 'DM',
  },
  {
    name: 'Dominican Republic',
    phoneCode: '+1 809',
    countryCode: 'DO',
  },
  {
    name: 'Dahomey',
    countryCode: 'DY',
  },
  {
    name: 'Algeria',
    phoneCode: '+213',
    countryCode: 'DZ',
  },
  {
    name: 'Ceuta, Mulilla',
    countryCode: 'EA',
  },
  {
    name: 'Ecuador',
    phoneCode: '+593',
    countryCode: 'EC',
  },
  {
    name: 'Estonia',
    phoneCode: '+372',
    countryCode: 'EE',
  },
  {
    name: 'Egypt',
    phoneCode: '+20',
    countryCode: 'EG',
  },
  {
    name: 'Western Sahara',
    phoneCode: '+212',
    countryCode: 'EH',
  },
  {
    name: 'Eritrea',
    phoneCode: '+291',
    countryCode: 'ER',
  },
  {
    name: 'Spain',
    phoneCode: '+34',
    countryCode: 'ES',
  },
  {
    name: 'Ethiopia',
    phoneCode: '+251',
    countryCode: 'ET',
  },
  {
    name: 'European Union',
    phoneCode: '+388',
    countryCode: 'EU',
  },
  {
    name: 'Finland',
    phoneCode: '+358',
    countryCode: 'FI',
  },
  {
    name: 'Fiji',
    phoneCode: '+679',
    countryCode: 'FJ',
  },
  {
    name: 'Falkland Islands',
    phoneCode: '+500',
    countryCode: 'FK',
  },
  {
    name: 'Micronesia, Federated States Of',
    phoneCode: '+691',
    countryCode: 'FM',
  },
  {
    name: 'Faroe Islands',
    phoneCode: '+298',
    countryCode: 'FO',
  },
  {
    name: 'French Southern and Antarctic Territories',
    countryCode: 'FQ',
  },
  {
    name: 'France',
    phoneCode: '+33',
    countryCode: 'FR',
  },
  {
    name: 'France, Metropolitan',
    phoneCode: '+241',
    countryCode: 'FX',
  },
  {
    name: 'Gabon',
    phoneCode: '+241',
    countryCode: 'GA',
  },
  {
    name: 'Grenada',
    phoneCode: '+473',
    countryCode: 'GD',
  },
  {
    name: 'Georgia',
    phoneCode: '+995',
    countryCode: 'GE',
  },
  {
    name: 'Gilbert and Ellice Islands',
    countryCode: 'GE',
  },
  {
    name: 'French Guiana',
    phoneCode: '+594',
    countryCode: 'GF',
  },
  {
    name: 'Guernsey',
    phoneCode: '+44',
    countryCode: 'GG',
  },
  {
    name: 'Ghana',
    phoneCode: '+233',
    countryCode: 'GH',
  },
  {
    name: 'Gibraltar',
    phoneCode: '+350',
    countryCode: 'GI',
  },
  {
    name: 'Greenland',
    phoneCode: '+299',
    countryCode: 'GL',
  },
  {
    name: 'Gambia',
    phoneCode: '+220',
    countryCode: 'GM',
  },
  {
    name: 'Guinea',
    phoneCode: '+224',
    countryCode: 'GN',
  },
  {
    name: 'Guadeloupe',
    phoneCode: '+590',
    countryCode: 'GP',
  },
  {
    name: 'Equatorial Guinea',
    phoneCode: '+240',
    countryCode: 'GQ',
  },
  {
    name: 'Greece',
    phoneCode: '+30',
    countryCode: 'GR',
  },
  {
    name: 'South Georgia And The South Sandwich Islands',
    countryCode: 'GS',
  },
  {
    name: 'Guatemala',
    phoneCode: '+502',
    countryCode: 'GT',
  },
  {
    name: 'Guam',
    phoneCode: '+1 671',
    countryCode: 'GU',
  },
  {
    name: 'Guinea-bissau',
    phoneCode: '+245',
    countryCode: 'GW',
  },
  {
    name: 'Guyana',
    phoneCode: '+592',
    countryCode: 'GY',
  },
  {
    name: 'Hong Kong',
    phoneCode: '+852',
    countryCode: 'HK',
  },
  {
    name: 'Heard Island And McDonald Islands',
    countryCode: 'HM',
  },
  {
    name: 'Honduras',
    phoneCode: '+504',
    countryCode: 'HN',
  },
  {
    name: 'Croatia',
    phoneCode: '+385',
    countryCode: 'HR',
  },
  {
    name: 'Haiti',
    phoneCode: '+509',
    countryCode: 'HT',
  },
  {
    name: 'Hungary',
    phoneCode: '+36',
    countryCode: 'HU',
  },
  {
    name: 'Upper Volta',
    countryCode: 'HV',
  },
  {
    name: 'Canary Islands',
    countryCode: 'IC',
  },
  {
    name: 'Indonesia',
    phoneCode: '+62',
    countryCode: 'ID',
  },
  {
    name: 'Ireland',
    phoneCode: '+353',
    countryCode: 'IE',
  },
  {
    name: 'Israel',
    phoneCode: '+972',
    countryCode: 'IL',
  },
  {
    name: 'Isle Of Man',
    phoneCode: '+44',
    countryCode: 'IM',
  },
  {
    name: 'India',
    phoneCode: '+91',
    countryCode: 'IN',
  },
  {
    name: 'British Indian Ocean Territory',
    phoneCode: '+246',
    countryCode: 'IO',
  },
  {
    name: 'Iraq',
    phoneCode: '+964',
    countryCode: 'IQ',
  },
  {
    name: 'Iran, Islamic Republic Of',
    phoneCode: '+98',
    countryCode: 'IR',
  },
  {
    name: 'Iceland',
    phoneCode: '+354',
    countryCode: 'IS',
  },
  {
    name: 'Italy',
    phoneCode: '+39',
    countryCode: 'IT',
  },
  {
    name: 'Jersey',
    phoneCode: '+44',
    countryCode: 'JE',
  },
  {
    name: 'Jamaica',
    phoneCode: '+1 876',
    countryCode: 'JM',
  },
  {
    name: 'Jordan',
    phoneCode: '+962',
    countryCode: 'JO',
  },
  {
    name: 'Japan',
    phoneCode: '+81',
    countryCode: 'JP',
  },
  {
    name: 'Johnston Island',
    countryCode: 'JT',
  },
  {
    name: 'Kenya',
    phoneCode: '+254',
    countryCode: 'KE',
  },
  {
    name: 'Kyrgyzstan',
    phoneCode: '+996',
    countryCode: 'KG',
  },
  {
    name: 'Cambodia',
    phoneCode: '+855',
    countryCode: 'KH',
  },
  {
    name: 'Kiribati',
    phoneCode: '+686',
    countryCode: 'KI',
  },
  {
    name: 'Comoros',
    phoneCode: '+269',
    countryCode: 'KM',
  },
  {
    name: 'Saint Kitts And Nevis',
    phoneCode: '+1 869',
    countryCode: 'KN',
  },
  {
    name: "Korea, Democratic People's Republic Of",
    phoneCode: '+850',
    countryCode: 'KP',
  },
  {
    name: 'Korea, Republic Of',
    phoneCode: '+82',
    countryCode: 'KR',
  },
  {
    name: 'Kuwait',
    phoneCode: '+965',
    countryCode: 'KW',
  },
  {
    name: 'Cayman Islands',
    phoneCode: '+1 345',
    countryCode: 'KY',
  },
  {
    name: 'Kazakhstan',
    phoneCode: '+7',
    countryCode: 'KZ',
  },
  {
    name: "Lao People's Democratic Republic",
    phoneCode: '+856',
    countryCode: 'LA',
  },
  {
    name: 'Lebanon',
    phoneCode: '+961',
    countryCode: 'LB',
  },
  {
    name: 'Saint Lucia',
    phoneCode: '+1 758',
    countryCode: 'LC',
  },
  {
    name: 'Liechtenstein',
    phoneCode: '+423',
    countryCode: 'LI',
  },
  {
    name: 'Sri Lanka',
    phoneCode: '+94',
    countryCode: 'LK',
  },
  {
    name: 'Liberia',
    phoneCode: '+231',
    countryCode: 'LR',
  },
  {
    name: 'Lesotho',
    phoneCode: '+266',
    countryCode: 'LS',
  },
  {
    name: 'Lithuania',
    phoneCode: '+370',
    countryCode: 'LT',
  },
  {
    name: 'Luxembourg',
    phoneCode: '+352',
    countryCode: 'LU',
  },
  {
    name: 'Latvia',
    phoneCode: '+371',
    countryCode: 'LV',
  },
  {
    name: 'Libya',
    phoneCode: '+218',
    countryCode: 'LY',
  },
  {
    name: 'Morocco',
    phoneCode: '+212',
    countryCode: 'MA',
  },
  {
    name: 'Monaco',
    phoneCode: '+377',
    countryCode: 'MC',
  },
  {
    name: 'Moldova',
    phoneCode: '+373',
    countryCode: 'MD',
  },
  {
    name: 'Montenegro',
    phoneCode: '+382',
    countryCode: 'ME',
  },
  {
    name: 'Saint Martin',
    phoneCode: '+590',
    countryCode: 'MF',
  },
  {
    name: 'Madagascar',
    phoneCode: '+261',
    countryCode: 'MG',
  },
  {
    name: 'Marshall Islands',
    phoneCode: '+692',
    countryCode: 'MH',
  },
  {
    name: 'Midway Islands',
    countryCode: 'MI',
  },
  {
    name: 'Macedonia, The Former Yugoslav Republic Of',
    phoneCode: '+389',
    countryCode: 'MK',
  },
  {
    name: 'Mali',
    phoneCode: '+223',
    countryCode: 'ML',
  },
  {
    name: 'Myanmar',
    phoneCode: '+95',
    countryCode: 'MM',
  },
  {
    name: 'Mongolia',
    phoneCode: '+976',
    countryCode: 'MN',
  },
  {
    name: 'Macao',
    phoneCode: '+853',
    countryCode: 'MO',
  },
  {
    name: 'Northern Mariana Islands',
    phoneCode: '+1 670',
    countryCode: 'MP',
  },
  {
    name: 'Martinique',
    phoneCode: '+596',
    countryCode: 'MQ',
  },
  {
    name: 'Mauritania',
    phoneCode: '+222',
    countryCode: 'MR',
  },
  {
    name: 'Montserrat',
    phoneCode: '+1 664',
    countryCode: 'MS',
  },
  {
    name: 'Malta',
    phoneCode: '+356',
    countryCode: 'MT',
  },
  {
    name: 'Mauritius',
    phoneCode: '+230',
    countryCode: 'MU',
  },
  {
    name: 'Maldives',
    phoneCode: '+960',
    countryCode: 'MV',
  },
  {
    name: 'Malawi',
    phoneCode: '+265',
    countryCode: 'MW',
  },
  {
    name: 'Mexico',
    phoneCode: '+52',
    countryCode: 'MX',
  },
  {
    name: 'Malaysia',
    phoneCode: '+60',
    countryCode: 'MY',
  },
  {
    name: 'Mozambique',
    phoneCode: '+258',
    countryCode: 'MZ',
  },
  {
    name: 'Namibia',
    phoneCode: '+264',
    countryCode: 'NA',
  },
  {
    name: 'New Caledonia',
    phoneCode: '+687',
    countryCode: 'NC',
  },
  {
    name: 'Niger',
    phoneCode: '+227',
    countryCode: 'NE',
  },
  {
    name: 'Norfolk Island',
    phoneCode: '+672',
    countryCode: 'NF',
  },
  {
    name: 'Nigeria',
    phoneCode: '+234',
    countryCode: 'NG',
  },
  {
    name: 'New Hebrides',
    countryCode: 'NH',
  },
  {
    name: 'Nicaragua',
    phoneCode: '+505',
    countryCode: 'NI',
  },
  {
    name: 'Netherlands',
    phoneCode: '+31',
    countryCode: 'NL',
  },
  {
    name: 'Norway',
    phoneCode: '+47',
    countryCode: 'NO',
  },
  {
    name: 'Nepal',
    phoneCode: '+977',
    countryCode: 'NP',
  },
  {
    name: 'Dronning Maud Land',
    countryCode: 'NQ',
  },
  {
    name: 'Nauru',
    phoneCode: '+674',
    countryCode: 'NR',
  },
  {
    name: 'Neutral Zone',
    countryCode: 'NT',
  },
  {
    name: 'Niue',
    phoneCode: '+683',
    countryCode: 'NU',
  },
  {
    name: 'New Zealand',
    phoneCode: '+64',
    countryCode: 'NZ',
  },
  {
    name: 'Oman',
    phoneCode: '+968',
    countryCode: 'OM',
  },
  {
    name: 'Panama',
    phoneCode: '+507',
    countryCode: 'PA',
  },
  {
    name: 'Pacific Islands, Trust Territory of the',
    countryCode: 'PC',
  },
  {
    name: 'Peru',
    phoneCode: '+51',
    countryCode: 'PE',
  },
  {
    name: 'French Polynesia',
    phoneCode: '+689',
    countryCode: 'PF',
  },
  {
    name: 'Papua New Guinea',
    phoneCode: '+675',
    countryCode: 'PG',
  },
  {
    name: 'Philippines',
    phoneCode: '+63',
    countryCode: 'PH',
  },
  {
    name: 'Pakistan',
    phoneCode: '+92',
    countryCode: 'PK',
  },
  {
    name: 'Poland',
    phoneCode: '+48',
    countryCode: 'PL',
  },
  {
    name: 'Saint Pierre And Miquelon',
    phoneCode: '+508',
    countryCode: 'PM',
  },
  {
    name: 'Pitcairn',
    phoneCode: '+872',
    countryCode: 'PN',
  },
  {
    name: 'Puerto Rico',
    phoneCode: '+1 787',
    countryCode: 'PR',
  },
  {
    name: 'Palestinian Territory, Occupied',
    phoneCode: '+970',
    countryCode: 'PS',
  },
  {
    name: 'Portugal',
    phoneCode: '+351',
    countryCode: 'PT',
  },
  {
    name: 'U.S. Miscellaneous Pacific Islands',
    countryCode: 'PU',
  },
  {
    name: 'Palau',
    phoneCode: '+680',
    countryCode: 'PW',
  },
  {
    name: 'Paraguay',
    phoneCode: '+595',
    countryCode: 'PY',
  },
  {
    name: 'Panama Canal Zone',
    countryCode: 'PZ',
  },
  {
    name: 'Qatar',
    phoneCode: '+974',
    countryCode: 'QA',
  },
  {
    name: 'Reunion',
    phoneCode: '+262',
    countryCode: 'RE',
  },
  {
    name: 'Southern Rhodesia',
    countryCode: 'RH',
  },
  {
    name: 'Romania',
    phoneCode: '+40',
    countryCode: 'RO',
  },
  {
    name: 'Serbia',
    phoneCode: '+381',
    countryCode: 'RS',
  },
  {
    name: 'Russian Federation',
    phoneCode: '+7',
    countryCode: 'RU',
  },
  {
    name: 'Rwanda',
    phoneCode: '+250',
    countryCode: 'RW',
  },
  {
    name: 'Saudi Arabia',
    phoneCode: '+966',
    countryCode: 'SA',
  },
  {
    name: 'Solomon Islands',
    phoneCode: '+677',
    countryCode: 'SB',
  },
  {
    name: 'Seychelles',
    phoneCode: '+248',
    countryCode: 'SC',
  },
  {
    name: 'Sudan',
    phoneCode: '+249',
    countryCode: 'SD',
  },
  {
    name: 'Sweden',
    phoneCode: '+46',
    countryCode: 'SE',
  },
  {
    name: 'Singapore',
    phoneCode: '+65',
    countryCode: 'SG',
  },
  {
    name: 'Saint Helena, Ascension And Tristan Da Cunha',
    phoneCode: '+290',
    countryCode: 'SH',
  },
  {
    name: 'Slovenia',
    phoneCode: '+386',
    countryCode: 'SI',
  },
  {
    name: 'Svalbard And Jan Mayen',
    phoneCode: '+47',
    countryCode: 'SJ',
  },
  {
    name: 'Slovakia',
    phoneCode: '+421',
    countryCode: 'SK',
  },
  {
    name: 'Sikkim',
    countryCode: 'SK',
  },
  {
    name: 'Sierra Leone',
    phoneCode: '+232',
    countryCode: 'SL',
  },
  {
    name: 'San Marino',
    phoneCode: '+378',
    countryCode: 'SM',
  },
  {
    name: 'Senegal',
    phoneCode: '+221',
    countryCode: 'SN',
  },
  {
    name: 'Somalia',
    phoneCode: '+252',
    countryCode: 'SO',
  },
  {
    name: 'Suriname',
    phoneCode: '+597',
    countryCode: 'SR',
  },
  {
    name: 'South Sudan',
    phoneCode: '+211',
    countryCode: 'SS',
  },
  {
    name: 'Sao Tome and Principe',
    phoneCode: '+239',
    countryCode: 'ST',
  },
  {
    name: 'USSR',
    countryCode: 'SU',
  },
  {
    name: 'El Salvador',
    phoneCode: '+503',
    countryCode: 'SV',
  },
  {
    name: 'Sint Maarten',
    phoneCode: '+1 721',
    countryCode: 'SX',
  },
  {
    name: 'Syrian Arab Republic',
    phoneCode: '+963',
    countryCode: 'SY',
  },
  {
    name: 'Swaziland',
    phoneCode: '+268',
    countryCode: 'SZ',
  },
  {
    name: 'Tristan de Cunha',
    phoneCode: '+290',
    countryCode: 'TA',
  },
  {
    name: 'Turks And Caicos Islands',
    phoneCode: '+1 649',
    countryCode: 'TC',
  },
  {
    name: 'Chad',
    phoneCode: '+235',
    countryCode: 'TD',
  },
  {
    name: 'French Southern Territories',
    countryCode: 'TF',
  },
  {
    name: 'Togo',
    phoneCode: '+228',
    countryCode: 'TG',
  },
  {
    name: 'Thailand',
    phoneCode: '+66',
    countryCode: 'TH',
  },
  {
    name: 'Tajikistan',
    phoneCode: '+992',
    countryCode: 'TJ',
  },
  {
    name: 'Tokelau',
    phoneCode: '+690',
    countryCode: 'TK',
  },
  {
    name: 'Timor-Leste, Democratic Republic of',
    phoneCode: '+670',
    countryCode: 'TL',
  },
  {
    name: 'Turkmenistan',
    phoneCode: '+993',
    countryCode: 'TM',
  },
  {
    name: 'Tunisia',
    phoneCode: '+216',
    countryCode: 'TN',
  },
  {
    name: 'Tonga',
    phoneCode: '+676',
    countryCode: 'TO',
  },
  {
    name: 'East Timor',
    countryCode: 'TP',
  },
  {
    name: 'Turkey',
    phoneCode: '+90',
    countryCode: 'TR',
  },
  {
    name: 'Trinidad And Tobago',
    phoneCode: '+1 868',
    countryCode: 'TT',
  },
  {
    name: 'Tuvalu',
    phoneCode: '+688',
    countryCode: 'TV',
  },
  {
    name: 'Taiwan',
    phoneCode: '+886',
    countryCode: 'TW',
  },
  {
    name: 'Tanzania, United Republic Of',
    phoneCode: '+255',
    countryCode: 'TZ',
  },
  {
    name: 'Ukraine',
    phoneCode: '+380',
    countryCode: 'UA',
  },
  {
    name: 'Uganda',
    phoneCode: '+256',
    countryCode: 'UG',
  },
  {
    name: 'United Kingdom',
    countryCode: 'UK',
  },
  {
    name: 'United States Minor Outlying Islands',
    phoneCode: '+1',
    countryCode: 'UM',
  },
  {
    name: 'United States',
    phoneCode: '+1',
    countryCode: 'US',
  },
  {
    name: 'Uruguay',
    phoneCode: '+598',
    countryCode: 'UY',
  },
  {
    name: 'Uzbekistan',
    phoneCode: '+998',
    countryCode: 'UZ',
  },
  {
    name: 'Vatican City State',
    phoneCode: '+379',
    countryCode: 'VA',
  },
  {
    name: 'Saint Vincent And The Grenadines',
    phoneCode: '+1 784',
    countryCode: 'VC',
  },
  {
    name: 'Viet-Nam, Democratic Republic of',
    countryCode: 'VD',
  },
  {
    name: 'Venezuela, Bolivarian Republic Of',
    phoneCode: '+58',
    countryCode: 'VE',
  },
  {
    name: 'Virgin Islands (British)',
    phoneCode: '+1 284',
    countryCode: 'VG',
  },
  {
    name: 'Virgin Islands (US)',
    phoneCode: '+1 340',
    countryCode: 'VI',
  },
  {
    name: 'Viet Nam',
    phoneCode: '+84',
    countryCode: 'VN',
  },
  {
    name: 'Vanuatu',
    phoneCode: '+678',
    countryCode: 'VU',
  },
  {
    name: 'Wallis And Futuna',
    phoneCode: '+681',
    countryCode: 'WF',
  },
  {
    name: 'Wake Island',
    countryCode: 'WK',
  },
  {
    name: 'Samoa',
    phoneCode: '+685',
    countryCode: 'WS',
  },
  {
    name: 'Kosovo',
    phoneCode: '+383',
    countryCode: 'XK',
  },
  {
    name: 'Yemen, Democratic',
    countryCode: 'YD',
  },
  {
    name: 'Yemen',
    phoneCode: '+967',
    countryCode: 'YE',
  },
  {
    name: 'Mayotte',
    phoneCode: '+262',
    countryCode: 'YT',
  },
  {
    name: 'Yugoslavia',
    countryCode: 'YU',
  },
  {
    name: 'South Africa',
    phoneCode: '+27',
    countryCode: 'ZA',
  },
  {
    name: 'Zambia',
    phoneCode: '+260',
    countryCode: 'ZM',
  },
  {
    name: 'Zaire',
    countryCode: 'ZR',
  },
  {
    name: 'Zimbabwe',
    phoneCode: '+263',
    countryCode: 'ZW',
  },
];

// this will format your date like this --> 19 May, 2024
export const dateFormatter = dt => {
  const date = new Date(dt);
  const formattedDate = date.toLocaleDateString('en-US', {
    day: 'numeric', // Use 2-digit padding for day (optional)
    month: 'long',
    year: 'numeric',
  });

  return formattedDate;
};

export const getLatLong = async address => {
  const key = environment.GOOGLE_API_KEY;
  const url =
    'https://maps.googleapis.com/maps/api/geocode/json?address=' +
    address +
    '&key=' +
    key;

  if (key && address) {
    const data = await getData(url);
    console.log(data);
    return data?.results[0]?.geometry?.location;
  }
};
