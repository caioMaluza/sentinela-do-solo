import { useEffect, useRef, useState } from 'react';

import {
  MapContainer,
  TileLayer,
  WMSTileLayer,
  Polygon,
  Polyline,
  CircleMarker,
  Tooltip,
  useMap
} from 'react-leaflet';

import {
  LocateFixed,
  MapPin,
  Accessibility,
  Users,
  Layers,
  Radio,
  Expand
} from 'lucide-react';

import 'leaflet/dist/leaflet.css';

import { clusters } from '../data/clusters';
import {
  SOIL_TYPES,
  soilZones,
  getCoverageForSensor
} from '../data/soilZones';

import { labels, risk } from '../lib/risk';
import { SectionTitle, Badge } from './UI';
import { useLocation } from '../hooks/useLocation';

const riskColors = {
  stable: '#489574',
  returned: '#489574',
  attention: '#e2b547',
  critical: '#cd4f4a',
  evacuation: '#b92936',
  unknown: '#8b918b'
};

const priority = {
  unknown: -1,
  stable: 0,
  returned: 0,
  attention: 1,
  critical: 2,
  evacuation: 3
};

const CITY_BOUNDS = [
  [-23.74, -46.85],
  [-23.34, -46.36]
];

const WMS_URL =
  'https://wms.geosampa.prefeitura.sp.gov.br/geoserver/geoportal/wms';

function Viewport({
  cluster,
  zones,
  overview,
  focusedZone,
  shelters,
  selectedShelterId,
  position,
  resetRevision
}) {
  const map = useMap();
  const zoneKey = zones.map(zone => zone.id).join(',');
  const shelterKey = shelters.map(shelter => shelter.id).join(',');

  useEffect(() => {
    map.invalidateSize();

    const selected = shelters.find(
      shelter => shelter.id === selectedShelterId
    );

    const points = selected
      ? [
          [cluster.lat, cluster.lon],
          [selected.lat, selected.lon]
        ]
      : focusedZone
        ? focusedZone.positions
        : overview
          ? zones.flatMap(zone => zone.positions)
          : [
              ...getCoverageForSensor(cluster.sensor)
                .flatMap(zone => zone.positions),
              ...shelters.map(shelter => [shelter.lat, shelter.lon])
            ];

    if (points.length > 1) {
      map.fitBounds(points, {
        padding: [30, 30],
        maxZoom: 14,
        animate: false
      });
    } else {
      map.setView([cluster.lat, cluster.lon], 13);
    }
  }, [
    map,
    cluster.id,
    zoneKey,
    overview,
    focusedZone?.id,
    shelterKey,
    selectedShelterId
  ]);

  useEffect(() => {
    if (resetRevision > 0) {
      map.fitBounds(zones.flatMap(zone => zone.positions), {
        padding: [30, 30],
        maxZoom: 14,
        animate: false
      });
    }
  }, [map, resetRevision]);

  useEffect(() => {
    if (position) {
      map.setView([position.lat, position.lon], 14);
    }
  }, [map, position]);

  return null;
}

export function RegionMap({
  cluster,
  regions = clusters,
  decisions = {},
  expanded = false,
  overview = false,
  showShelters = false,
  shelters = [],
  selectedShelterId,
  onSelectRegion,
  onSelectShelter,
  title = 'Solos e estacas do bairro',
  allowLocation = false
}) {
  const gps = useLocation();

  const [layer, setLayer] = useState('soil');
  const [focusSelection, setFocusSelection] = useState(false);
  const [selectedZoneId, setSelectedZoneId] = useState(null);
  const [officialError, setOfficialError] = useState(false);
  const [resetRevision, setResetRevision] = useState(0);

  const previousCluster = useRef(cluster.id);

  const allowedSensors = new Set(
    regions.map(region => region.sensor)
  );

  const zones = soilZones.filter(zone =>
    zone.sensorIds.some(id => allowedSensors.has(id))
  );

  const selectedZone =
    zones.find(zone => zone.id === selectedZoneId)
    || zones.find(zone => zone.sensorIds.includes(cluster.sensor))
    || zones[0];

  const visibleShelters = showShelters ? shelters : [];

  const linkedSensors = selectedZone
    ? regions.filter(region =>
        selectedZone.sensorIds.includes(region.sensor)
      )
    : [];

  const coveredNeighborhoods = selectedZone
    ? regions.filter(region =>
        selectedZone.clusterIds.includes(region.id)
      )
    : [];

  const soil = selectedZone
    ? SOIL_TYPES[selectedZone.soilType]
    : null;

  useEffect(() => {
    if (previousCluster.current !== cluster.id) {
      setSelectedZoneId(null);
      setFocusSelection(true);
      previousCluster.current = cluster.id;
    }
  }, [cluster.id]);

  function chooseZone(zone) {
    setResetRevision(0);
    setSelectedZoneId(zone.id);
    setFocusSelection(true);

    const reference = regions.find(region =>
      zone.sensorIds.includes(region.sensor)
    );

    if (reference) onSelectRegion?.(reference.id);
  }

  function zoneState(zone) {
    return regions
      .filter(region => zone.sensorIds.includes(region.sensor))
      .map(region => decisions[region.id] || risk(region.rate))
      .reduce(
        (highest, next) =>
          priority[next] > priority[highest] ? next : highest,
        'unknown'
      );
  }

  return (
    <section className="card map-card territory-map">
      <SectionTitle title={title}>
        <Badge tone="neutral">
          São Paulo · {regions.length} bairros
        </Badge>
      </SectionTitle>

      <div
        className="map-toolbar"
        role="group"
        aria-label="Camadas do mapa"
      >
        <span><Layers size={15} />Camadas</span>

        {[
          ['soil', 'Tipos de solo'],
          ['risk', 'Risco simulado'],
          ['official', 'Carta GeoSampa']
        ].map(([id, label]) => (
          <button
            type="button"
            key={id}
            className={`map-layer-button ${layer === id ? 'active' : ''}`}
            aria-pressed={layer === id}
            onClick={() => {
              setLayer(id);
              setOfficialError(false);
            }}
          >
            {label}
          </button>
        ))}

        <button
          type="button"
          className="map-layer-button map-fit"
          onClick={() => {
            setFocusSelection(false);
            setResetRevision(previous => previous + 1);
          }}
        >
          <Expand size={14} />
          Ver recorte
        </button>
      </div>

      <div className={`map-wrap${expanded ? ' expanded' : ''}`}>
        <MapContainer
          center={[cluster.lat, cluster.lon]}
          zoom={13}
          minZoom={11}
          maxZoom={17}
          maxBounds={CITY_BOUNDS}
          maxBoundsViscosity={1}
          scrollWheelZoom={false}
        >
          <Viewport
            cluster={cluster}
            zones={zones}
            overview={!focusSelection || overview}
            focusedZone={focusSelection ? selectedZone : null}
            shelters={visibleShelters}
            selectedShelterId={selectedShelterId}
            position={allowLocation ? gps.position : null}
            resetRevision={resetRevision}
          />

          <TileLayer
            attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {layer === 'official' && (
            <WMSTileLayer
              url={WMS_URL}
              layers="carta_geotecnica"
              styles=""
              format="image/png"
              transparent
              opacity={0.65}
              version="1.1.1"
              eventHandlers={{
                tileerror: () => setOfficialError(true)
              }}
              attribution="Carta Geotécnica 2024 · Prefeitura de São Paulo / GeoSampa"
            />
          )}

          {layer !== 'official' && zones.map(zone => {
            const type = SOIL_TYPES[zone.soilType];
            const selected = zone.id === selectedZone?.id;

            return (
              <Polygon
                key={zone.id}
                positions={zone.positions}
                pathOptions={{
                  color: selected ? '#203c31' : '#ffffff',
                  weight: selected ? 3 : 1.5,
                  fillColor: layer === 'soil'
                    ? type.color
                    : riskColors[zoneState(zone)],
                  fillOpacity: selected ? 0.48 : 0.35,
                  dashArray: selected ? '8 6' : undefined
                }}
                eventHandlers={{
                  click: () => chooseZone(zone)
                }}
              >
                <Tooltip>
                  <strong>
                    {layer === 'soil'
                      ? type.label
                      : labels[zoneState(zone)]}
                  </strong>
                  <br />
                  Zona ilustrativa · clique para ver estacas
                </Tooltip>
              </Polygon>
            );
          })}

          {regions.map(region => (
            <CircleMarker
              key={region.id}
              center={[region.lat, region.lon]}
              radius={region.id === cluster.id ? 9 : 6}
              pathOptions={{
                color: '#fff',
                weight: 3,
                fillColor:
                  riskColors[decisions[region.id] || risk(region.rate)],
                fillOpacity: 1
              }}
              eventHandlers={{
                click: () => {
                  setSelectedZoneId(null);
                  setFocusSelection(true);
                  onSelectRegion?.(region.id);
                }
              }}
            >
              <Tooltip
                permanent
                direction="top"
                className="neighborhood-marker"
              >
                <strong>{region.name}</strong>
                <br />
                {region.sensor} · referência simulada
              </Tooltip>
            </CircleMarker>
          ))}

          {selectedZone && layer !== 'official'
            && linkedSensors.map(region => (
              <Polyline
                key={`link-${region.id}`}
                positions={[
                  [region.lat, region.lon],
                  selectedZone.positions[1]
                ]}
                interactive={false}
                pathOptions={{
                  color: '#173f36',
                  weight: 1.5,
                  dashArray: '3 7',
                  opacity: 0.6
                }}
              />
            ))}

          {visibleShelters.map(shelter => (
            <CircleMarker
              key={shelter.id}
              center={[shelter.lat, shelter.lon]}
              radius={shelter.id === selectedShelterId ? 12 : 8}
              pathOptions={{
                color: '#fff',
                fillColor: '#32699a',
                fillOpacity: 1,
                weight: 3
              }}
              eventHandlers={{
                click: () => onSelectShelter?.(shelter.id)
              }}
            >
              <Tooltip>
                {shelter.name}
                <br />
                {shelter.capacity} vagas simuladas
              </Tooltip>
            </CircleMarker>
          ))}

          {allowLocation && gps.position && (
            <CircleMarker
              center={[gps.position.lat, gps.position.lon]}
              radius={7}
              pathOptions={{
                color: '#fff',
                fillColor: '#32699a',
                fillOpacity: 1
              }}
            >
              <Tooltip>Sua localização</Tooltip>
            </CircleMarker>
          )}
        </MapContainer>

        <div className="map-caption">
          {layer === 'official'
            ? 'Carta oficial GeoSampa · estacas e coberturas do protótipo são fictícias'
            : 'Recorte Norte / Noroeste · solos e contornos ilustrativos, sem validade geotécnica'}
        </div>
      </div>

      {layer === 'official' && officialError && (
        <p className="soil-note" role="status">
          Não foi possível carregar parte da carta GeoSampa.
          Você pode voltar a Tipos de solo para explorar o cenário ilustrativo.
        </p>
      )}

      <div className="map-bottom">
        <div className="soil-legend">
          {layer === 'soil'
            ? Object.entries(SOIL_TYPES).map(([id, type]) => (
                <span key={id}>
                  <i
                    className="soil-swatch"
                    style={{ background: type.color }}
                  />
                  {type.label}
                </span>
              ))
            : layer === 'risk' ? (
                <>
                  <span>
                    <i
                      className="soil-swatch"
                      style={{ background: riskColors.stable }}
                    />
                    Estável
                  </span>
                  <span>
                    <i
                      className="soil-swatch"
                      style={{ background: riskColors.attention }}
                    />
                    Atenção
                  </span>
                  <span>
                    <i
                      className="soil-swatch"
                      style={{ background: riskColors.critical }}
                    />
                    Crítico
                  </span>
                </>
              ) : (
                <a
                  href={`${WMS_URL}?service=WMS&version=1.1.1&request=GetLegendGraphic&format=image/png&layer=carta_geotecnica`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Consultar legenda oficial ↗
                </a>
              )}

          {layer !== 'official' && (
            <span>
              <i className="dashed-key" />
              Cobertura ilustrativa selecionada
            </span>
          )}
        </div>

        {allowLocation && (
          <button
            type="button"
            className="text-button"
            onClick={gps.locate}
            disabled={gps.loading}
          >
            <LocateFixed size={16} />
            {gps.loading ? 'Localizando…' : 'Minha localização'}
          </button>
        )}
      </div>

      {layer === 'official' ? (
        <div className="soil-note">
          Camada externa da Carta Geotécnica 2024, não um mapa validado
          de argila/areia. Pode ficar indisponível se o serviço GeoSampa
          não responder. As outras camadas funcionam com dados locais
          do protótipo.
        </div>
      ) : selectedZone && (
        <div className="soil-detail">
          <div className="soil-detail-grid">
            <div>
              <span className="eyebrow">ZONA CONTÍNUA · EXEMPLO</span>

              <h3>
                <i
                  className="soil-swatch"
                  style={{ background: soil.color }}
                />
                {soil.label}
              </h3>

              <p>{soil.description}</p>
            </div>

            <div>
              <span className="eyebrow">
                REFERÊNCIAS DE BAIRRO NO CENÁRIO
              </span>

              <p>
                {coveredNeighborhoods.map(region => region.name).join(' · ')
                  || 'Área de cobertura no recorte'}
              </p>

              <div className="soil-sensor-list">
                {linkedSensors.map(region => (
                  <button
                    type="button"
                    key={region.id}
                    className={`sensor-pin ${
                      cluster.id === region.id ? 'selected' : ''
                    }`}
                    aria-pressed={cluster.id === region.id}
                    onClick={() => {
                      onSelectRegion?.(region.id);
                      setFocusSelection(true);
                    }}
                  >
                    <Radio size={14} />
                    {region.sensor} · {region.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <p className="coverage-note">
            O tracejado mostra um vínculo de monitoramento inventado
            para demonstrar uma zona atravessando bairros. Mesmo solo
            e proximidade, sozinhos, não comprovam alcance de uma estaca
            nem capacidade de previsão; isso exige calibração e
            avaliação geotécnica.
          </p>
        </div>
      )}

      {layer === 'risk' && (
        <p className="soil-note">
          A cor da zona segue o maior nível simulado entre as estacas
          vinculadas. Não representa previsão espacial do risco.
        </p>
      )}

      {showShelters && (
        <p className="soil-note">
          Pontos azuis: abrigos fictícios do exercício.
          As cores dos solos não representam nível de risco.
        </p>
      )}

      {allowLocation && gps.error && (
        <p className="error panel-padding" role="status">
          {gps.error}
        </p>
      )}
    </section>
  );
}

export function ShelterRoute({
  cluster,
  shelters = [],
  selectedShelterId,
  onSelectShelter
}) {
  return (
    <section className="card panel-padding shelter-list">
      <SectionTitle
        eyebrow="EXERCÍCIO DE ALERTA VERMELHO"
        title="Abrigos próximos · ilustrativos"
      >
        <Badge tone="neutral">{shelters.length} exemplos</Badge>
      </SectionTitle>

      <p className="muted shelter-note">
        Pontos fictícios próximos ao centro de {cluster.name}.
        Distâncias em linha reta; não representam trajetos
        nem abrigos oficiais.
      </p>

      {shelters.map(shelter => (
        <button
          type="button"
          key={shelter.id}
          className={`shelter-item${
            shelter.id === selectedShelterId ? ' selected' : ''
          }`}
          aria-pressed={shelter.id === selectedShelterId}
          onClick={() => onSelectShelter?.(shelter.id)}
        >
          <span className="shelter-heading">
            <MapPin size={19} />
            <strong>{shelter.name}</strong>
          </span>

          <span className="shelter-distance">
            {(shelter.distanceMeters / 1000).toLocaleString('pt-BR', {
              maximumFractionDigits: 1
            })}{' '}
            km em linha reta
          </span>

          <span className="shelter-meta">
            <Users size={15} />
            {shelter.capacity} vagas simuladas
          </span>

          <span className="shelter-meta">
            <Accessibility size={15} />
            {shelter.accessibility}
          </span>

          <span className="text-button">Destacar ponto no mapa</span>
        </button>
      ))}

      <p className="muted shelter-note">
        Em uma emergência real, siga as orientações oficiais.
        Defesa Civil: <a href="tel:199">199</a>
        {' · '}
        Bombeiros: <a href="tel:193">193</a>.
      </p>
    </section>
  );
}