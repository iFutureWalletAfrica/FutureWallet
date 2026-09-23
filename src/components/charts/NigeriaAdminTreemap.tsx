import { useState, useEffect, useRef, useMemo } from 'react';
import * as d3 from 'd3';
import { 
  Building2, 
  MapPin, 
  Globe, 
  Users, 
  ShieldCheck, 
  ArrowLeft, 
  Maximize2, 
  Info, 
  Layers, 
  Phone, 
  Mail, 
  TrendingUp,
  CreditCard,
  CheckCircle2,
  ZoomIn,
  RefreshCw,
  SlidersHorizontal
} from 'lucide-react';
import { useCurrency } from '../../context/CurrencyContext';

export interface TreemapNodeData {
  id: string;
  name: string;
  level: 'National' | 'Regional' | 'State' | 'LGA';
  adminTitle: string;
  adminLead: string;
  phone: string;
  email: string;
  reportsTo: string;
  clearanceLevel: string;
  adminCount: number; // Active administrators at this node/leaf
  supervisedAgents: number; // Count of field agents
  monthlyVolumeNgn: number; // Volume in NGN
  posTerminals: number;
  zoneCode?: 'NW' | 'SW' | 'NC' | 'SS' | 'SE' | 'NE';
  children?: TreemapNodeData[];
}

export const NIGERIA_ADMIN_TREE_DATA: TreemapNodeData = {
  id: 'ng-federal-hq',
  name: 'Federal Republic of Nigeria',
  level: 'National',
  adminTitle: 'National Director of Operations & CBN Regulatory Lead',
  adminLead: 'Dr. Aminu Sanusi Bello',
  phone: '+234 800 439 8800',
  email: 'a.bello@ifuturewallet.com',
  reportsTo: 'Sharahbil Muhammd Sani (Chief Executive Officer)',
  clearanceLevel: 'Federal Clearance Level 4',
  adminCount: 8,
  supervisedAgents: 184200,
  monthlyVolumeNgn: 73500000000,
  posTerminals: 142600,
  children: [
    {
      id: 'reg-nw',
      name: 'North West Geopolitical Zone',
      level: 'Regional',
      adminTitle: 'Zonal Regional Director (North West)',
      adminLead: 'Alhaji Mansur Garba',
      phone: '+234 803 555 0192',
      email: 'm.garba@ifuturewallet.com',
      reportsTo: 'Dr. Aminu Sanusi Bello (National Ops Director)',
      clearanceLevel: 'Zonal Clearance Level 3',
      zoneCode: 'NW',
      adminCount: 18,
      supervisedAgents: 42800,
      monthlyVolumeNgn: 18400000000,
      posTerminals: 34100,
      children: [
        {
          id: 'st-nw-kano',
          name: 'Kano State Directorate',
          level: 'State',
          adminTitle: 'State Operations Manager (Kano)',
          adminLead: 'Hajia Fatima Balarabe',
          phone: '+234 803 711 0021',
          email: 'f.balarabe@ifuturewallet.com',
          reportsTo: 'Alhaji Mansur Garba (NW Zonal Director)',
          clearanceLevel: 'State Clearance Level 2',
          zoneCode: 'NW',
          adminCount: 12,
          supervisedAgents: 18200,
          monthlyVolumeNgn: 6400000000,
          posTerminals: 14800,
          children: [
            {
              id: 'lga-kn-municipal',
              name: 'Kano Municipal Cluster',
              level: 'LGA',
              adminTitle: 'LGA Field Cluster Supervisor',
              adminLead: 'Comrade Usman Danladi',
              phone: '+234 803 111 8901',
              email: 'u.danladi@ifuturewallet.com',
              reportsTo: 'Hajia Fatima Balarabe (State Manager)',
              clearanceLevel: 'LGA Field Clearance Level 1',
              zoneCode: 'NW',
              adminCount: 8,
              supervisedAgents: 1450,
              monthlyVolumeNgn: 1440000000,
              posTerminals: 1280,
            },
            {
              id: 'lga-kn-fagge',
              name: 'Fagge Sabon Gari Market',
              level: 'LGA',
              adminTitle: 'LGA Field Cluster Supervisor',
              adminLead: 'Ibrahim Magaji',
              phone: '+234 803 333 9901',
              email: 'i.magaji@ifuturewallet.com',
              reportsTo: 'Hajia Fatima Balarabe (State Manager)',
              clearanceLevel: 'LGA Field Clearance Level 1',
              zoneCode: 'NW',
              adminCount: 10,
              supervisedAgents: 1620,
              monthlyVolumeNgn: 1920000000,
              posTerminals: 1490,
            },
            {
              id: 'lga-kn-dala',
              name: 'Dala Grassroots Cluster',
              level: 'LGA',
              adminTitle: 'LGA Field Cluster Supervisor',
              adminLead: 'Sani Abdullahi',
              phone: '+234 803 222 7812',
              email: 's.abdullahi@ifuturewallet.com',
              reportsTo: 'Hajia Fatima Balarabe (State Manager)',
              clearanceLevel: 'LGA Field Clearance Level 1',
              zoneCode: 'NW',
              adminCount: 6,
              supervisedAgents: 980,
              monthlyVolumeNgn: 960000000,
              posTerminals: 840,
            },
            {
              id: 'lga-kn-nasarawa',
              name: 'Nasarawa Commercial Sector',
              level: 'LGA',
              adminTitle: 'LGA Field Cluster Supervisor',
              adminLead: 'Zainab Garba',
              phone: '+234 803 444 1234',
              email: 'z.garba@ifuturewallet.com',
              reportsTo: 'Hajia Fatima Balarabe (State Manager)',
              clearanceLevel: 'LGA Field Clearance Level 1',
              zoneCode: 'NW',
              adminCount: 5,
              supervisedAgents: 890,
              monthlyVolumeNgn: 840000000,
              posTerminals: 760,
            },
            {
              id: 'lga-kn-gwale',
              name: 'Gwale & Kumbotso Cluster',
              level: 'LGA',
              adminTitle: 'LGA Field Cluster Supervisor',
              adminLead: 'Mustapha Dabo',
              phone: '+234 803 555 6677',
              email: 'm.dabo@ifuturewallet.com',
              reportsTo: 'Hajia Fatima Balarabe (State Manager)',
              clearanceLevel: 'LGA Field Clearance Level 1',
              zoneCode: 'NW',
              adminCount: 7,
              supervisedAgents: 1100,
              monthlyVolumeNgn: 1050000000,
              posTerminals: 920,
            },
          ],
        },
        {
          id: 'st-nw-kaduna',
          name: 'Kaduna State Directorate',
          level: 'State',
          adminTitle: 'State Operations Coordinator (Kaduna)',
          adminLead: 'Mukhtar Shehu',
          phone: '+234 805 111 6723',
          email: 'm.shehu@ifuturewallet.com',
          reportsTo: 'Alhaji Mansur Garba (NW Zonal Director)',
          clearanceLevel: 'State Clearance Level 2',
          zoneCode: 'NW',
          adminCount: 8,
          supervisedAgents: 8900,
          monthlyVolumeNgn: 2900000000,
          posTerminals: 7100,
          children: [
            {
              id: 'lga-kd-north',
              name: 'Kaduna North Cluster',
              level: 'LGA',
              adminTitle: 'LGA Field Cluster Supervisor',
              adminLead: 'Nasiru Makarfi',
              phone: '+234 805 222 3344',
              email: 'n.makarfi@ifuturewallet.com',
              reportsTo: 'Mukhtar Shehu (State Coordinator)',
              clearanceLevel: 'LGA Field Clearance Level 1',
              zoneCode: 'NW',
              adminCount: 6,
              supervisedAgents: 1120,
              monthlyVolumeNgn: 1020000000,
              posTerminals: 960,
            },
            {
              id: 'lga-kd-zaria',
              name: 'Zaria Commercial Trade Hub',
              level: 'LGA',
              adminTitle: 'LGA Field Cluster Supervisor',
              adminLead: 'Balarabe Samaru',
              phone: '+234 805 333 4455',
              email: 'b.samaru@ifuturewallet.com',
              reportsTo: 'Mukhtar Shehu (State Coordinator)',
              clearanceLevel: 'LGA Field Clearance Level 1',
              zoneCode: 'NW',
              adminCount: 7,
              supervisedAgents: 1340,
              monthlyVolumeNgn: 1200000000,
              posTerminals: 1100,
            },
          ],
        },
        {
          id: 'st-nw-katsina',
          name: 'Katsina State Directorate',
          level: 'State',
          adminTitle: 'State Operations Coordinator (Katsina)',
          adminLead: 'Bello Dan-Musa',
          phone: '+234 806 777 4412',
          email: 'b.danmusa@ifuturewallet.com',
          reportsTo: 'Alhaji Mansur Garba (NW Zonal Director)',
          clearanceLevel: 'State Clearance Level 2',
          zoneCode: 'NW',
          adminCount: 6,
          supervisedAgents: 5800,
          monthlyVolumeNgn: 1800000000,
          posTerminals: 4400,
          children: [
            {
              id: 'lga-kt-municipal',
              name: 'Katsina Central Cluster',
              level: 'LGA',
              adminTitle: 'LGA Field Cluster Supervisor',
              adminLead: 'Kabiru Daura',
              phone: '+234 806 888 5522',
              email: 'k.daura@ifuturewallet.com',
              reportsTo: 'Bello Dan-Musa (State Coordinator)',
              clearanceLevel: 'LGA Field Clearance Level 1',
              zoneCode: 'NW',
              adminCount: 5,
              supervisedAgents: 880,
              monthlyVolumeNgn: 780000000,
              posTerminals: 680,
            },
            {
              id: 'lga-kt-funtua',
              name: 'Funtua Agro Corridor',
              level: 'LGA',
              adminTitle: 'LGA Field Cluster Supervisor',
              adminLead: 'Umaru Malumfashi',
              phone: '+234 806 999 6633',
              email: 'u.malumfashi@ifuturewallet.com',
              reportsTo: 'Bello Dan-Musa (State Coordinator)',
              clearanceLevel: 'LGA Field Clearance Level 1',
              zoneCode: 'NW',
              adminCount: 6,
              supervisedAgents: 960,
              monthlyVolumeNgn: 840000000,
              posTerminals: 740,
            },
          ],
        },
        {
          id: 'st-nw-sokoto-kebbi',
          name: 'Sokoto & Kebbi Border Directorate',
          level: 'State',
          adminTitle: 'State Sector Coordinator',
          adminLead: 'Aliyu Tambuwal',
          phone: '+234 803 999 1122',
          email: 'a.tambuwal@ifuturewallet.com',
          reportsTo: 'Alhaji Mansur Garba (NW Zonal Director)',
          clearanceLevel: 'State Clearance Level 2',
          zoneCode: 'NW',
          adminCount: 8,
          supervisedAgents: 6400,
          monthlyVolumeNgn: 1950000000,
          posTerminals: 5100,
          children: [
            {
              id: 'lga-sk-central',
              name: 'Sokoto North & Wamakko',
              level: 'LGA',
              adminTitle: 'LGA Field Cluster Supervisor',
              adminLead: 'Attahiru Bafarawa',
              phone: '+234 803 888 2211',
              email: 'a.bafarawa@ifuturewallet.com',
              reportsTo: 'Aliyu Tambuwal (State Sector Coordinator)',
              clearanceLevel: 'LGA Field Clearance Level 1',
              zoneCode: 'NW',
              adminCount: 6,
              supervisedAgents: 950,
              monthlyVolumeNgn: 860000000,
              posTerminals: 750,
            },
            {
              id: 'lga-kb-argungu',
              name: 'Birnin Kebbi & Argungu Kiosks',
              level: 'LGA',
              adminTitle: 'LGA Field Cluster Supervisor',
              adminLead: 'Usman Jega',
              phone: '+234 803 777 3344',
              email: 'u.jega@ifuturewallet.com',
              reportsTo: 'Aliyu Tambuwal (State Sector Coordinator)',
              clearanceLevel: 'LGA Field Clearance Level 1',
              zoneCode: 'NW',
              adminCount: 5,
              supervisedAgents: 780,
              monthlyVolumeNgn: 690000000,
              posTerminals: 620,
            },
          ],
        },
      ],
    },
    {
      id: 'reg-sw',
      name: 'South West Geopolitical Zone',
      level: 'Regional',
      adminTitle: 'Zonal Regional Director (South West)',
      adminLead: 'Folashade Adeleke-Smith',
      phone: '+234 802 331 4400',
      email: 'f.adeleke@ifuturewallet.com',
      reportsTo: 'Dr. Aminu Sanusi Bello (National Ops Director)',
      clearanceLevel: 'Zonal Clearance Level 3',
      zoneCode: 'SW',
      adminCount: 22,
      supervisedAgents: 54200,
      monthlyVolumeNgn: 24100000000,
      posTerminals: 48900,
      children: [
        {
          id: 'st-sw-lagos',
          name: 'Lagos State Directorate',
          level: 'State',
          adminTitle: 'State Operations Director (Lagos)',
          adminLead: 'Babajide Ogundipe',
          phone: '+234 802 888 1902',
          email: 'b.ogundipe@ifuturewallet.com',
          reportsTo: 'Folashade Adeleke-Smith (SW Zonal Director)',
          clearanceLevel: 'State Clearance Level 2',
          zoneCode: 'SW',
          adminCount: 18,
          supervisedAgents: 28400,
          monthlyVolumeNgn: 12800000000,
          posTerminals: 25900,
          children: [
            {
              id: 'lga-la-ikeja',
              name: 'Ikeja & Computer Village Hub',
              level: 'LGA',
              adminTitle: 'LGA Field Cluster Supervisor',
              adminLead: 'Kehinde Fashola',
              phone: '+234 802 333 0019',
              email: 'k.fashola@ifuturewallet.com',
              reportsTo: 'Babajide Ogundipe (State Director)',
              clearanceLevel: 'LGA Field Clearance Level 1',
              zoneCode: 'SW',
              adminCount: 12,
              supervisedAgents: 2400,
              monthlyVolumeNgn: 2670000000,
              posTerminals: 2280,
            },
            {
              id: 'lga-la-alimosho',
              name: 'Alimosho High-Density Corridor',
              level: 'LGA',
              adminTitle: 'LGA Field Cluster Supervisor',
              adminLead: 'Moruf Agbaje',
              phone: '+234 802 444 8812',
              email: 'm.agbaje@ifuturewallet.com',
              reportsTo: 'Babajide Ogundipe (State Director)',
              clearanceLevel: 'LGA Field Clearance Level 1',
              zoneCode: 'SW',
              adminCount: 14,
              supervisedAgents: 3100,
              monthlyVolumeNgn: 2820000000,
              posTerminals: 2790,
            },
            {
              id: 'lga-la-etiosa',
              name: 'Eti-Osa Lekki & Victoria Island',
              level: 'LGA',
              adminTitle: 'LGA Field Cluster Supervisor',
              adminLead: 'Ngozi Okeke',
              phone: '+234 802 555 9944',
              email: 'n.okeke@ifuturewallet.com',
              reportsTo: 'Babajide Ogundipe (State Director)',
              clearanceLevel: 'LGA Field Clearance Level 1',
              zoneCode: 'SW',
              adminCount: 8,
              supervisedAgents: 1850,
              monthlyVolumeNgn: 3120000000,
              posTerminals: 1780,
            },
            {
              id: 'lga-la-surulere',
              name: 'Surulere & Oshodi Transit Hub',
              level: 'LGA',
              adminTitle: 'LGA Field Cluster Supervisor',
              adminLead: 'Olamide Bakare',
              phone: '+234 802 666 1122',
              email: 'o.bakare@ifuturewallet.com',
              reportsTo: 'Babajide Ogundipe (State Director)',
              clearanceLevel: 'LGA Field Clearance Level 1',
              zoneCode: 'SW',
              adminCount: 9,
              supervisedAgents: 1920,
              monthlyVolumeNgn: 2150000000,
              posTerminals: 1810,
            },
          ],
        },
        {
          id: 'st-sw-oyo',
          name: 'Oyo State Directorate',
          level: 'State',
          adminTitle: 'State Operations Coordinator (Oyo)',
          adminLead: 'Adewale Gbadamosi',
          phone: '+234 802 119 5500',
          email: 'a.gbadamosi@ifuturewallet.com',
          reportsTo: 'Folashade Adeleke-Smith (SW Zonal Director)',
          clearanceLevel: 'State Clearance Level 2',
          zoneCode: 'SW',
          adminCount: 8,
          supervisedAgents: 7200,
          monthlyVolumeNgn: 2400000000,
          posTerminals: 6100,
          children: [
            {
              id: 'lga-oy-ibadan',
              name: 'Ibadan North & Bodija Market',
              level: 'LGA',
              adminTitle: 'LGA Field Cluster Supervisor',
              adminLead: 'Taofeek Arapaja',
              phone: '+234 802 777 4433',
              email: 't.arapaja@ifuturewallet.com',
              reportsTo: 'Adewale Gbadamosi (State Coordinator)',
              clearanceLevel: 'LGA Field Clearance Level 1',
              zoneCode: 'SW',
              adminCount: 8,
              supervisedAgents: 1420,
              monthlyVolumeNgn: 1350000000,
              posTerminals: 1220,
            },
          ],
        },
        {
          id: 'st-sw-ogun',
          name: 'Ogun Industrial Directorate',
          level: 'State',
          adminTitle: 'State Operations Coordinator (Ogun)',
          adminLead: 'Olumide Adebayo',
          phone: '+234 802 999 6611',
          email: 'o.adebayo@ifuturewallet.com',
          reportsTo: 'Folashade Adeleke-Smith (SW Zonal Director)',
          clearanceLevel: 'State Clearance Level 2',
          zoneCode: 'SW',
          adminCount: 7,
          supervisedAgents: 6800,
          monthlyVolumeNgn: 2100000000,
          posTerminals: 5900,
          children: [
            {
              id: 'lga-og-ota',
              name: 'Ota & Sagamu Industrial Axis',
              level: 'LGA',
              adminTitle: 'LGA Field Cluster Supervisor',
              adminLead: 'Segun Osoba',
              phone: '+234 802 111 7788',
              email: 's.osoba@ifuturewallet.com',
              reportsTo: 'Olumide Adebayo (State Coordinator)',
              clearanceLevel: 'LGA Field Clearance Level 1',
              zoneCode: 'SW',
              adminCount: 7,
              supervisedAgents: 1350,
              monthlyVolumeNgn: 1240000000,
              posTerminals: 1190,
            },
          ],
        },
      ],
    },
    {
      id: 'reg-nc',
      name: 'North Central Geopolitical Zone',
      level: 'Regional',
      adminTitle: 'Zonal Regional Director (North Central)',
      adminLead: 'Col. Raymond Doma (Rtd.)',
      phone: '+234 809 778 1234',
      email: 'r.doma@ifuturewallet.com',
      reportsTo: 'Dr. Aminu Sanusi Bello (National Ops Director)',
      clearanceLevel: 'Zonal Clearance Level 3',
      zoneCode: 'NC',
      adminCount: 14,
      supervisedAgents: 26400,
      monthlyVolumeNgn: 9800000000,
      posTerminals: 20800,
      children: [
        {
          id: 'st-nc-fct',
          name: 'Federal Capital Territory Directorate (Abuja)',
          level: 'State',
          adminTitle: 'State Director of Operations (FCT)',
          adminLead: 'Dr. Aisha Maikori',
          phone: '+234 809 444 8811',
          email: 'a.maikori@ifuturewallet.com',
          reportsTo: 'Col. Raymond Doma (NC Zonal Director)',
          clearanceLevel: 'State Clearance Level 2',
          zoneCode: 'NC',
          adminCount: 10,
          supervisedAgents: 8100,
          monthlyVolumeNgn: 3800000000,
          posTerminals: 7400,
          children: [
            {
              id: 'lga-nc-amac',
              name: 'Abuja Municipal Area Council (AMAC)',
              level: 'LGA',
              adminTitle: 'LGA Field Cluster Supervisor',
              adminLead: 'Bala Mohammed',
              phone: '+234 809 111 2233',
              email: 'b.mohammed@ifuturewallet.com',
              reportsTo: 'Dr. Aisha Maikori (FCT Director)',
              clearanceLevel: 'LGA Field Clearance Level 1',
              zoneCode: 'NC',
              adminCount: 8,
              supervisedAgents: 2100,
              monthlyVolumeNgn: 2160000000,
              posTerminals: 1950,
            },
            {
              id: 'lga-nc-gwagwalada',
              name: 'Gwagwalada & Bwari Cluster',
              level: 'LGA',
              adminTitle: 'LGA Field Cluster Supervisor',
              adminLead: 'Chinedu Aliyu',
              phone: '+234 809 222 3344',
              email: 'c.aliyu@ifuturewallet.com',
              reportsTo: 'Dr. Aisha Maikori (FCT Director)',
              clearanceLevel: 'LGA Field Clearance Level 1',
              zoneCode: 'NC',
              adminCount: 6,
              supervisedAgents: 1200,
              monthlyVolumeNgn: 980000000,
              posTerminals: 1050,
            },
          ],
        },
        {
          id: 'st-nc-niger-plateau',
          name: 'Niger & Plateau Middle-Belt Directorate',
          level: 'State',
          adminTitle: 'State Sector Coordinator',
          adminLead: 'Solomon Lar',
          phone: '+234 809 555 7766',
          email: 's.lar@ifuturewallet.com',
          reportsTo: 'Col. Raymond Doma (NC Zonal Director)',
          clearanceLevel: 'State Clearance Level 2',
          zoneCode: 'NC',
          adminCount: 8,
          supervisedAgents: 6900,
          monthlyVolumeNgn: 2200000000,
          posTerminals: 5400,
          children: [
            {
              id: 'lga-nc-jos',
              name: 'Jos Central & Terminus Market',
              level: 'LGA',
              adminTitle: 'LGA Field Cluster Supervisor',
              adminLead: 'Pam Gyang',
              phone: '+234 809 666 8899',
              email: 'p.gyang@ifuturewallet.com',
              reportsTo: 'Solomon Lar (State Sector Coordinator)',
              clearanceLevel: 'LGA Field Clearance Level 1',
              zoneCode: 'NC',
              adminCount: 6,
              supervisedAgents: 980,
              monthlyVolumeNgn: 920000000,
              posTerminals: 860,
            },
          ],
        },
      ],
    },
    {
      id: 'reg-ss',
      name: 'South South Geopolitical Zone',
      level: 'Regional',
      adminTitle: 'Zonal Regional Director (South South)',
      adminLead: 'Engr. Tonye Briggs',
      phone: '+234 803 991 7844',
      email: 't.briggs@ifuturewallet.com',
      reportsTo: 'Dr. Aminu Sanusi Bello (National Ops Director)',
      clearanceLevel: 'Zonal Clearance Level 3',
      zoneCode: 'SS',
      adminCount: 12,
      supervisedAgents: 24100,
      monthlyVolumeNgn: 8900000000,
      posTerminals: 19400,
      children: [
        {
          id: 'st-ss-rivers',
          name: 'Rivers State Directorate',
          level: 'State',
          adminTitle: 'State Operations Coordinator (Rivers)',
          adminLead: 'Tamuno Davies',
          phone: '+234 803 222 9012',
          email: 't.davies@ifuturewallet.com',
          reportsTo: 'Engr. Tonye Briggs (SS Zonal Director)',
          clearanceLevel: 'State Clearance Level 2',
          zoneCode: 'SS',
          adminCount: 10,
          supervisedAgents: 9400,
          monthlyVolumeNgn: 3400000000,
          posTerminals: 8200,
          children: [
            {
              id: 'lga-ss-ph',
              name: 'Port Harcourt City Center',
              level: 'LGA',
              adminTitle: 'LGA Field Cluster Supervisor',
              adminLead: 'Baridue Kpakol',
              phone: '+234 803 777 6655',
              email: 'b.kpakol@ifuturewallet.com',
              reportsTo: 'Tamuno Davies (State Coordinator)',
              clearanceLevel: 'LGA Field Clearance Level 1',
              zoneCode: 'SS',
              adminCount: 9,
              supervisedAgents: 1750,
              monthlyVolumeNgn: 1620000000,
              posTerminals: 1580,
            },
            {
              id: 'lga-ss-obio',
              name: 'Obio-Akpor & Eleme Axis',
              level: 'LGA',
              adminTitle: 'LGA Field Cluster Supervisor',
              adminLead: 'Soboma Jackrich',
              phone: '+234 803 666 5544',
              email: 's.jackrich@ifuturewallet.com',
              reportsTo: 'Tamuno Davies (State Coordinator)',
              clearanceLevel: 'LGA Field Clearance Level 1',
              zoneCode: 'SS',
              adminCount: 7,
              supervisedAgents: 1320,
              monthlyVolumeNgn: 1180000000,
              posTerminals: 1140,
            },
          ],
        },
        {
          id: 'st-ss-delta-edo',
          name: 'Delta & Edo Maritime Directorate',
          level: 'State',
          adminTitle: 'State Sector Coordinator',
          adminLead: 'Osagie Ehanire',
          phone: '+234 803 444 9900',
          email: 'o.ehanire@ifuturewallet.com',
          reportsTo: 'Engr. Tonye Briggs (SS Zonal Director)',
          clearanceLevel: 'State Clearance Level 2',
          zoneCode: 'SS',
          adminCount: 9,
          supervisedAgents: 7800,
          monthlyVolumeNgn: 2800000000,
          posTerminals: 6200,
          children: [
            {
              id: 'lga-ss-warri',
              name: 'Warri & Uvwie Commercial Hub',
              level: 'LGA',
              adminTitle: 'LGA Field Cluster Supervisor',
              adminLead: 'Chief Efe Clark',
              phone: '+234 803 333 8811',
              email: 'e.clark@ifuturewallet.com',
              reportsTo: 'Osagie Ehanire (State Sector Coordinator)',
              clearanceLevel: 'LGA Field Clearance Level 1',
              zoneCode: 'SS',
              adminCount: 7,
              supervisedAgents: 1340,
              monthlyVolumeNgn: 1220000000,
              posTerminals: 1180,
            },
          ],
        },
      ],
    },
    {
      id: 'reg-se',
      name: 'South East Geopolitical Zone',
      level: 'Regional',
      adminTitle: 'Zonal Regional Director (South East)',
      adminLead: 'Chief Nnamdi Okoli',
      phone: '+234 814 662 9011',
      email: 'n.okoli@ifuturewallet.com',
      reportsTo: 'Dr. Aminu Sanusi Bello (National Ops Director)',
      clearanceLevel: 'Zonal Clearance Level 3',
      zoneCode: 'SE',
      adminCount: 12,
      supervisedAgents: 22500,
      monthlyVolumeNgn: 8200000000,
      posTerminals: 18200,
      children: [
        {
          id: 'st-se-anambra',
          name: 'Anambra State Directorate',
          level: 'State',
          adminTitle: 'State Operations Coordinator (Anambra)',
          adminLead: 'Chukwuma Nwankwo',
          phone: '+234 813 555 7800',
          email: 'c.nwankwo@ifuturewallet.com',
          reportsTo: 'Chief Nnamdi Okoli (SE Zonal Director)',
          clearanceLevel: 'State Clearance Level 2',
          zoneCode: 'SE',
          adminCount: 9,
          supervisedAgents: 8600,
          monthlyVolumeNgn: 3100000000,
          posTerminals: 7300,
          children: [
            {
              id: 'lga-se-onitsha',
              name: 'Onitsha North & Main Market',
              level: 'LGA',
              adminTitle: 'LGA Field Cluster Supervisor',
              adminLead: 'Obinna Eze',
              phone: '+234 814 333 4411',
              email: 'o.eze@ifuturewallet.com',
              reportsTo: 'Chukwuma Nwankwo (State Coordinator)',
              clearanceLevel: 'LGA Field Clearance Level 1',
              zoneCode: 'SE',
              adminCount: 10,
              supervisedAgents: 1920,
              monthlyVolumeNgn: 1850000000,
              posTerminals: 1740,
            },
            {
              id: 'lga-se-nnewi',
              name: 'Nnewi Industrial Automotive Hub',
              level: 'LGA',
              adminTitle: 'LGA Field Cluster Supervisor',
              adminLead: 'Innocent Chukwuma',
              phone: '+234 814 222 3344',
              email: 'i.chukwuma@ifuturewallet.com',
              reportsTo: 'Chukwuma Nwankwo (State Coordinator)',
              clearanceLevel: 'LGA Field Clearance Level 1',
              zoneCode: 'SE',
              adminCount: 6,
              supervisedAgents: 1150,
              monthlyVolumeNgn: 1050000000,
              posTerminals: 980,
            },
          ],
        },
        {
          id: 'st-se-abia',
          name: 'Abia Commercial Directorate',
          level: 'State',
          adminTitle: 'State Operations Coordinator (Abia)',
          adminLead: 'Kalu Uche',
          phone: '+234 814 888 2211',
          email: 'k.uche@ifuturewallet.com',
          reportsTo: 'Chief Nnamdi Okoli (SE Zonal Director)',
          clearanceLevel: 'State Clearance Level 2',
          zoneCode: 'SE',
          adminCount: 8,
          supervisedAgents: 6900,
          monthlyVolumeNgn: 2400000000,
          posTerminals: 5800,
          children: [
            {
              id: 'lga-se-aba',
              name: 'Aba Ariaria Market Hub',
              level: 'LGA',
              adminTitle: 'LGA Field Cluster Supervisor',
              adminLead: 'Ikechukwu Kanu',
              phone: '+234 814 777 1199',
              email: 'i.kanu@ifuturewallet.com',
              reportsTo: 'Kalu Uche (State Coordinator)',
              clearanceLevel: 'LGA Field Clearance Level 1',
              zoneCode: 'SE',
              adminCount: 9,
              supervisedAgents: 1640,
              monthlyVolumeNgn: 1540000000,
              posTerminals: 1480,
            },
          ],
        },
      ],
    },
    {
      id: 'reg-ne',
      name: 'North East Geopolitical Zone',
      level: 'Regional',
      adminTitle: 'Zonal Regional Director (North East)',
      adminLead: 'Dr. Zanna Mustapha',
      phone: '+234 806 441 5590',
      email: 'z.mustapha@ifuturewallet.com',
      reportsTo: 'Dr. Aminu Sanusi Bello (National Ops Director)',
      clearanceLevel: 'Zonal Clearance Level 3',
      zoneCode: 'NE',
      adminCount: 10,
      supervisedAgents: 14200,
      monthlyVolumeNgn: 4100000000,
      posTerminals: 11200,
      children: [
        {
          id: 'st-ne-borno',
          name: 'Borno State Directorate',
          level: 'State',
          adminTitle: 'State Operations Coordinator (Borno)',
          adminLead: 'Ali Modu Sheriff',
          phone: '+234 806 222 9911',
          email: 'a.sheriff@ifuturewallet.com',
          reportsTo: 'Dr. Zanna Mustapha (NE Zonal Director)',
          clearanceLevel: 'State Clearance Level 2',
          zoneCode: 'NE',
          adminCount: 6,
          supervisedAgents: 3400,
          monthlyVolumeNgn: 1100000000,
          posTerminals: 2900,
          children: [
            {
              id: 'lga-ne-maiduguri',
              name: 'Maiduguri Monday Market Cluster',
              level: 'LGA',
              adminTitle: 'LGA Field Cluster Supervisor',
              adminLead: 'Bukar Mandara',
              phone: '+234 806 333 8822',
              email: 'b.mandara@ifuturewallet.com',
              reportsTo: 'Ali Modu Sheriff (State Coordinator)',
              clearanceLevel: 'LGA Field Clearance Level 1',
              zoneCode: 'NE',
              adminCount: 6,
              supervisedAgents: 940,
              monthlyVolumeNgn: 720000000,
              posTerminals: 820,
            },
          ],
        },
        {
          id: 'st-ne-adamawa-taraba',
          name: 'Adamawa & Taraba Border Directorate',
          level: 'State',
          adminTitle: 'State Sector Coordinator',
          adminLead: 'Ahmadu Fintiri',
          phone: '+234 806 555 4433',
          email: 'a.fintiri@ifuturewallet.com',
          reportsTo: 'Dr. Zanna Mustapha (NE Zonal Director)',
          clearanceLevel: 'State Clearance Level 2',
          zoneCode: 'NE',
          adminCount: 6,
          supervisedAgents: 4200,
          monthlyVolumeNgn: 1250000000,
          posTerminals: 3600,
          children: [
            {
              id: 'lga-ne-yola',
              name: 'Yola Jimeta Central Cluster',
              level: 'LGA',
              adminTitle: 'LGA Field Cluster Supervisor',
              adminLead: 'Sani Ribadu',
              phone: '+234 806 666 3311',
              email: 's.ribadu@ifuturewallet.com',
              reportsTo: 'Ahmadu Fintiri (State Sector Coordinator)',
              clearanceLevel: 'LGA Field Clearance Level 1',
              zoneCode: 'NE',
              adminCount: 5,
              supervisedAgents: 780,
              monthlyVolumeNgn: 640000000,
              posTerminals: 690,
            },
          ],
        },
      ],
    },
  ],
};

type MetricKey = 'adminCount' | 'supervisedAgents' | 'monthlyVolumeNgn';

export const NigeriaAdminTreemap = () => {
  const { currency, currencySymbol, formatNgn } = useCurrency();
  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [metric, setMetric] = useState<MetricKey>('adminCount');
  const [selectedNode, setSelectedNode] = useState<TreemapNodeData>(NIGERIA_ADMIN_TREE_DATA);
  const [hoveredNode, setHoveredNode] = useState<TreemapNodeData | null>(null);
  const [viewRootId, setViewRootId] = useState<string>('ng-federal-hq');

  // Breadcrumbs path calculation
  const breadcrumbs = useMemo(() => {
    const path: { id: string; name: string }[] = [];
    const findPath = (curr: TreemapNodeData): boolean => {
      path.push({ id: curr.id, name: curr.name });
      if (curr.id === viewRootId) return true;
      if (curr.children) {
        for (const child of curr.children) {
          if (findPath(child)) return true;
        }
      }
      path.pop();
      return false;
    };
    findPath(NIGERIA_ADMIN_TREE_DATA);
    return path;
  }, [viewRootId]);

  // Color generator based on Geopolitical zone and level
  const getNodeColor = (d: d3.HierarchyRectangularNode<TreemapNodeData>) => {
    const data = d.data;
    if (data.level === 'National') return '#10b981'; // Emerald

    const zoneColors: Record<string, { base: string; light: string; dark: string }> = {
      NW: { base: '#059669', light: '#34d399', dark: '#064e3b' }, // North West: Emerald
      SW: { base: '#0284c7', light: '#38bdf8', dark: '#0c4a6e' }, // South West: Sky Blue
      NC: { base: '#7c3aed', light: '#a78bfa', dark: '#4c1d95' }, // North Central: Violet
      SS: { base: '#d97706', light: '#fbbf24', dark: '#78350f' }, // South South: Amber
      SE: { base: '#2563eb', light: '#60a5fa', dark: '#1e3a8a' }, // South East: Blue
      NE: { base: '#e11d48', light: '#fb7185', dark: '#881337' }, // North East: Rose
    };

    const zone = data.zoneCode || 'NW';
    const palette = zoneColors[zone] || zoneColors.NW;

    if (data.level === 'Regional') return palette.base;
    if (data.level === 'State') return palette.light;
    return palette.dark;
  };

  // Find node by ID in tree
  const findNodeById = (node: TreemapNodeData, targetId: string): TreemapNodeData | null => {
    if (node.id === targetId) return node;
    if (node.children) {
      for (const child of node.children) {
        const found = findNodeById(child, targetId);
        if (found) return found;
      }
    }
    return null;
  };

  const activeSubtree = useMemo(() => {
    return findNodeById(NIGERIA_ADMIN_TREE_DATA, viewRootId) || NIGERIA_ADMIN_TREE_DATA;
  }, [viewRootId]);

  // D3 Treemap rendering logic
  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const containerWidth = containerRef.current.clientWidth || 800;
    const width = Math.max(containerWidth, 600);
    const height = 480;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    svg.attr('viewBox', `0 0 ${width} ${height}`);

    // Hierarchy construction
    const root = d3
      .hierarchy<TreemapNodeData>(activeSubtree)
      .sum((d) => {
        // If node has children, D3 sums them up. If it's a leaf, use value.
        if (d.children && d.children.length > 0) return 0;
        return d[metric] || 1;
      })
      .sort((a, b) => (b.value || 0) - (a.value || 0));

    // D3 Treemap layout generator
    const treemapLayout = d3
      .treemap<TreemapNodeData>()
      .size([width, height])
      .paddingTop(24)
      .paddingRight(4)
      .paddingInner(3)
      .round(true);

    const layoutRoot = treemapLayout(root);

    // Group container
    const g = svg.append('g');

    // Create node cells
    const cell = g
      .selectAll<SVGGElement, d3.HierarchyRectangularNode<TreemapNodeData>>('g')
      .data(layoutRoot.descendants())
      .join('g')
      .attr('transform', (d) => `translate(${d.x0},${d.y0})`);

    // Rectangles
    cell
      .append('rect')
      .attr('id', (d) => `rect-${d.data.id}`)
      .attr('width', (d) => Math.max(0, d.x1 - d.x0))
      .attr('height', (d) => Math.max(0, d.y1 - d.y0))
      .attr('fill', (d) => {
        if (d.depth === 0) return '#0f172a'; // Container
        return getNodeColor(d);
      })
      .attr('fill-opacity', (d) => {
        if (d.depth === 0) return 0.2;
        if (d.children) return 0.35;
        return 0.85;
      })
      .attr('stroke', (d) => {
        if (d.depth === 0) return '#334155';
        if (d.data.id === selectedNode.id) return '#38bdf8';
        return '#1e293b';
      })
      .attr('stroke-width', (d) => (d.data.id === selectedNode.id ? 2.5 : 1))
      .attr('rx', 6)
      .style('cursor', 'pointer')
      .on('mouseover', function (event, d) {
        d3.select(this)
          .transition()
          .duration(120)
          .attr('fill-opacity', 1)
          .attr('stroke', '#38bdf8')
          .attr('stroke-width', 2);
        setHoveredNode(d.data);
      })
      .on('mouseout', function (event, d) {
        d3.select(this)
          .transition()
          .duration(120)
          .attr('fill-opacity', d.children ? 0.35 : 0.85)
          .attr('stroke', d.data.id === selectedNode.id ? '#38bdf8' : '#1e293b')
          .attr('stroke-width', d.data.id === selectedNode.id ? 2.5 : 1);
        setHoveredNode(null);
      })
      .on('click', function (event, d) {
        setSelectedNode(d.data);
        // If node has children, double click or click zooms in
        if (d.children && d.children.length > 0 && d.data.id !== viewRootId) {
          setViewRootId(d.data.id);
        }
      });

    // Titles for parent containers (Zonal and State headers)
    cell
      .filter((d) => !!d.children && d.x1 - d.x0 > 70 && d.y1 - d.y0 > 28)
      .append('text')
      .attr('x', 6)
      .attr('y', 15)
      .attr('fill', '#94a3b8')
      .attr('font-size', '10px')
      .attr('font-weight', '600')
      .attr('font-family', 'ui-monospace, monospace')
      .text((d) => {
        const title = d.data.name;
        const maxLen = Math.floor((d.x1 - d.x0) / 7);
        return title.length > maxLen ? title.substring(0, maxLen) + '...' : title;
      });

    // Labels for leaf cells (LGAs and sub-clusters)
    cell
      .filter((d) => !d.children && d.x1 - d.x0 > 55 && d.y1 - d.y0 > 38)
      .append('text')
      .attr('x', 6)
      .attr('y', 18)
      .attr('fill', '#ffffff')
      .attr('font-size', (d) => (d.x1 - d.x0 > 110 ? '11px' : '9.5px'))
      .attr('font-weight', 'bold')
      .text((d) => {
        const title = d.data.name;
        const maxLen = Math.floor((d.x1 - d.x0) / 7.5);
        return title.length > maxLen ? title.substring(0, maxLen) + '..' : title;
      });

    // Sub-metric label in leaf
    cell
      .filter((d) => !d.children && d.x1 - d.x0 > 65 && d.y1 - d.y0 > 48)
      .append('text')
      .attr('x', 6)
      .attr('y', 33)
      .attr('fill', '#e2e8f0')
      .attr('font-size', '9px')
      .attr('font-family', 'ui-monospace, monospace')
      .text((d) => {
        if (metric === 'adminCount') return `${d.data.adminCount} Admins`;
        if (metric === 'supervisedAgents') return `${d.data.supervisedAgents.toLocaleString()} Agents`;
        return formatNgn(d.data.monthlyVolumeNgn, { decimals: 0 });
      });
  }, [activeSubtree, metric, selectedNode.id, viewRootId, currency, formatNgn]);

  // Handler to step back up one level
  const handleStepUp = () => {
    if (breadcrumbs.length > 1) {
      const parentId = breadcrumbs[breadcrumbs.length - 2].id;
      setViewRootId(parentId);
      const parentNode = findNodeById(NIGERIA_ADMIN_TREE_DATA, parentId);
      if (parentNode) setSelectedNode(parentNode);
    }
  };

  const handleResetToNational = () => {
    setViewRootId('ng-federal-hq');
    setSelectedNode(NIGERIA_ADMIN_TREE_DATA);
  };

  const inspect = hoveredNode || selectedNode;

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Top Controls & Explanation Bar */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-semibold flex items-center gap-1.5">
              <span>🇳🇬</span> D3.js Hierarchical Squarified Treemap
            </span>
            <span className="text-[11px] font-mono text-slate-400">
              National → 6 Geopolitical Zones → 36 States → 774 LGAs
            </span>
          </div>
          <h2 className="text-base font-bold text-white">
            Nigeria Government Administrators Distribution & Reporting Tree
          </h2>
          <p className="text-xs text-slate-400 max-w-2xl">
            Proportional visualization of administrative personnel allocation, reporting hierarchy, and jurisdictional field agent footprint across all Nigerian tiers.
          </p>
        </div>

        {/* Metric Selector Buttons */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
            Size by:
          </span>
          <div className="flex p-0.5 rounded-lg bg-slate-950 border border-slate-800 text-xs">
            <button
              onClick={() => setMetric('adminCount')}
              className={`px-2.5 py-1.5 rounded-md font-medium transition-all ${
                metric === 'adminCount'
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Admins Count
            </button>
            <button
              onClick={() => setMetric('supervisedAgents')}
              className={`px-2.5 py-1.5 rounded-md font-medium transition-all ${
                metric === 'supervisedAgents'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Field Agents
            </button>
            <button
              onClick={() => setMetric('monthlyVolumeNgn')}
              className={`px-2.5 py-1.5 rounded-md font-medium transition-all ${
                metric === 'monthlyVolumeNgn'
                  ? 'bg-indigo-500 text-white font-bold shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Monthly Inflow ({currencySymbol})
            </button>
          </div>
        </div>
      </div>

      {/* Breadcrumbs Navigation & Zoom Level */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-1 text-xs">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-slate-500 font-mono">Scope:</span>
          {breadcrumbs.map((crumb, idx) => (
            <div key={crumb.id} className="flex items-center gap-1.5">
              <button
                onClick={() => {
                  setViewRootId(crumb.id);
                  const node = findNodeById(NIGERIA_ADMIN_TREE_DATA, crumb.id);
                  if (node) setSelectedNode(node);
                }}
                className={`px-2 py-0.5 rounded transition-all font-mono ${
                  crumb.id === viewRootId
                    ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {crumb.name}
              </button>
              {idx < breadcrumbs.length - 1 && <span className="text-slate-600">/</span>}
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {breadcrumbs.length > 1 && (
            <button
              onClick={handleStepUp}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-medium border border-slate-700 transition-colors flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Step Up Level</span>
            </button>
          )}

          <button
            onClick={handleResetToNational}
            className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white text-xs border border-slate-800 transition-colors flex items-center gap-1"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset to National</span>
          </button>
        </div>
      </div>

      {/* Main Treemap Canvas + Administrator Inspector Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Treemap SVG Container */}
        <div 
          ref={containerRef}
          className="lg:col-span-2 p-4 rounded-xl bg-slate-900/90 border border-slate-800 shadow-xl overflow-hidden relative flex flex-col justify-between"
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-2">
            <div className="flex items-center gap-2 text-xs">
              <span className="font-semibold text-slate-300">
                Interactive Hierarchical Map
              </span>
              <span className="text-[10px] text-slate-500 font-mono">
                Click any region or tile to drill down into subordinates
              </span>
            </div>

            {/* Color Legend */}
            <div className="hidden sm:flex items-center gap-2 text-[10px] font-mono">
              <span className="flex items-center gap-1 text-emerald-400">
                <span className="w-2.5 h-2.5 rounded bg-emerald-600"></span> NW Zone
              </span>
              <span className="flex items-center gap-1 text-sky-400">
                <span className="w-2.5 h-2.5 rounded bg-sky-600"></span> SW Zone
              </span>
              <span className="flex items-center gap-1 text-violet-400">
                <span className="w-2.5 h-2.5 rounded bg-violet-600"></span> NC Zone
              </span>
              <span className="flex items-center gap-1 text-amber-400">
                <span className="w-2.5 h-2.5 rounded bg-amber-600"></span> SS Zone
              </span>
              <span className="flex items-center gap-1 text-blue-400">
                <span className="w-2.5 h-2.5 rounded bg-blue-600"></span> SE Zone
              </span>
              <span className="flex items-center gap-1 text-rose-400">
                <span className="w-2.5 h-2.5 rounded bg-rose-600"></span> NE Zone
              </span>
            </div>
          </div>

          <div className="w-full overflow-hidden rounded-lg bg-slate-950/60 p-1 border border-slate-850">
            <svg
              ref={svgRef}
              className="w-full h-auto select-none font-sans"
              style={{ minHeight: '440px' }}
            />
          </div>

          <div className="pt-3 flex items-center justify-between text-[11px] text-slate-400">
            <span>
              💡 <strong>Interaction:</strong> Hover for quick inspection, click to select, or click parent containers to zoom into that state or zone.
            </span>
            <span className="font-mono text-emerald-400">D3 Hierarchy v7.9</span>
          </div>
        </div>

        {/* Administrator Inspector & Reporting Chain Panel */}
        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-5 shadow-xl flex flex-col justify-between">
          <div className="space-y-4">
            <div className="pb-3 border-b border-slate-800 flex items-start justify-between">
              <div>
                <div className="flex items-center gap-1.5 mb-1">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase ${
                      inspect.level === 'National'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : inspect.level === 'Regional'
                        ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                        : inspect.level === 'State'
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    }`}
                  >
                    Level: {inspect.level} Government
                  </span>
                  {inspect.zoneCode && (
                    <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 text-[10px] font-mono">
                      {inspect.zoneCode} Zone
                    </span>
                  )}
                </div>
                <h3 className="text-base font-bold text-white">{inspect.name}</h3>
              </div>

              <div className="p-2 rounded-lg bg-slate-800 text-slate-300">
                <Info className="w-4 h-4 text-emerald-400" />
              </div>
            </div>

            {/* Officer in Charge Profile */}
            <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-850 space-y-2 text-xs">
              <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider block">
                Administrative Officer in Charge
              </span>
              <div className="text-sm font-bold text-white">{inspect.adminLead}</div>
              <div className="text-[11px] text-indigo-300 font-medium">{inspect.adminTitle}</div>
              <div className="text-[10px] text-emerald-400 font-mono">{inspect.clearanceLevel}</div>

              <div className="pt-2 border-t border-slate-800/80 space-y-1 text-[11px] text-slate-400">
                <div className="flex items-center gap-2">
                  <Phone className="w-3 h-3 text-emerald-400 shrink-0" />
                  <span className="font-mono text-slate-200">{inspect.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3 h-3 text-cyan-400 shrink-0" />
                  <span className="text-slate-300">{inspect.email}</span>
                </div>
              </div>
            </div>

            {/* Reporting Chain & Superior */}
            <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-850 space-y-2 text-xs">
              <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider block">
                Direct Reporting Chain
              </span>
              <div className="flex items-center gap-2 text-slate-300">
                <ArrowLeft className="w-3.5 h-3.5 text-indigo-400 rotate-90 shrink-0" />
                <span className="font-medium">
                  Reports to: <strong className="text-white">{inspect.reportsTo}</strong>
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                All high-value CICO authorizations and field agent license approvals flow upward through this reporting hierarchy.
              </p>
            </div>

            {/* Quantitative Footprint */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-850">
                <span className="text-[10px] text-slate-400 block">Admins on Duty</span>
                <span className="text-sm font-bold font-mono text-emerald-400">
                  {inspect.adminCount} Officers
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-850">
                <span className="text-[10px] text-slate-400 block">Supervised Agents</span>
                <span className="text-sm font-bold font-mono text-cyan-400">
                  {inspect.supervisedAgents.toLocaleString()}
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-850">
                <span className="text-[10px] text-slate-400 block">POS Terminals</span>
                <span className="text-sm font-bold font-mono text-indigo-300">
                  {inspect.posTerminals.toLocaleString()}
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-850">
                <span className="text-[10px] text-slate-400 block">Monthly Clearing</span>
                <span className="text-sm font-bold font-mono text-amber-400 transition-all duration-300">
                  {formatNgn(inspect.monthlyVolumeNgn, { decimals: 2 })}
                </span>
              </div>
            </div>
          </div>

          {/* Action Trigger */}
          <div className="pt-3 border-t border-slate-800">
            <button
              onClick={() => {
                if (inspect.children && inspect.children.length > 0) {
                  setViewRootId(inspect.id);
                }
              }}
              disabled={!inspect.children || inspect.children.length === 0}
              className={`w-full py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                inspect.children && inspect.children.length > 0
                  ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/20'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              <ZoomIn className="w-3.5 h-3.5" />
              {inspect.children && inspect.children.length > 0
                ? `Drill Down into ${inspect.name}`
                : 'Terminal Leaf Level (LGA)'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
