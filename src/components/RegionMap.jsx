import { useEffect } from 'react';

import {
  MapContainer,
  TileLayer,
  Circle,
  CircleMarker,
  Tooltip,
  useMap
} from 'react-leaflet';

import {
  LocateFixed,
  MapPin,
  Accessibility,
  Users
} from 'lucide-react';

import 'leaflet/dist/leaflet.css';

import { clusters } from '../data/clusters';
import { labels, risk } from '../lib/risk';
import { SectionTitle, Badge } from './UI';
import { useLocation } from '../hooks/useLocation';

const colors = {
  stable: '#4f9b77',
  returned: '#4f9b77',
  attention: '#e0b244',
  critical: '#d96165',
  evacuation: '#d13e4c',
  unknown: '#8795a8'
};

function MapViewport({
  cluster,
  regions,
  overview,
  shelters,
  selectedShelterId,
  position
}) {
  const map = useMap();

  const regionKey = regions.map(region => region.id).join(',');
  const shelterKey = shelters.map(shelter => shelter.id).join(',');

  useEffect(() => {
    map.invalidateSize();

    const selected = shelters.find(
      shelter => shelter.id === selectedShelterId
    );

    const points = overview
      ? regions.map(region => [region.lat, region.lon])
      : [
          [cluster.lat, cluster.lon],
          ...(selected ? [selected] : shelters).map(
            shelter => [shelter.lat, shelter.lon]
          )
        ];

    if (points.length > 1) {
      map.fitBounds(points, {
        padding: [44, 44],
        maxZoom: 14,
        animate: false
      });
    } else {
      map.setView(points[0] || [cluster.lat, cluster.lon], 13);
    }
  }, [
    map,
    cluster.id,
    overview,
    regionKey,
    shelterKey,
    selectedShelterId
  ]);

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
  title = 'Mapa das áreas monitoradas',
  allowLocation = false
}) {
  const gps = useLocation();
  const visibleShelters = showShelters ? shelters : [];

  return (
    <section className="card map-card">
      <SectionTitle title={title}>
        <Badge tone="neutral">
          {regions.length}{' '}
          {regions.length === 1
            ? 'área ilustrativa'
            : 'áreas ilustrativas'}
        </Badge>
      </SectionTitle>

      <div className={`map-wrap${expanded ? ' expanded' : ''}`}>
        <MapContainer
          center={[cluster.lat, cluster.lon]}
          zoom={13}
          scrollWheelZoom={false}
        >
          <MapViewport
            cluster={cluster}
            regions={regions}
            overview={overview}
            shelters={visibleShelters}
            selectedShelterId={selectedShelterId}
            position={allowLocation ? gps.position : null}
          />

          <TileLayer
            attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {regions.map(region => {
            const state = decisions[region.id] || risk(region.rate);
            const color = colors[state] || colors.unknown;
            const selected = region.id === cluster.id;

            const eventHandlers = onSelectRegion
              ? { click: () => onSelectRegion(region.id) }
              : {};

            return (
              <Circle
                key={region.id}
                center={[region.lat, region.lon]}
                radius={overview ? 1900 : 780}
                pathOptions={{
                  color,
                  fillColor: color,
                  fillOpacity: selected ? 0.36 : 0.23,
                  weight: selected ? 3 : 1.5
                }}
                eventHandlers={eventHandlers}
              >
                <Tooltip permanent direction="top">
                  <strong>{region.name}</strong>
                  <br />

                  {region.sensors} estacas ·{' '}
                  {labels[state] || labels.unknown}
                </Tooltip>

                <CircleMarker
                  center={[region.lat, region.lon]}
                  radius={5}
                  pathOptions={{
                    color: '#fff',
                    fillColor: color,
                    fillOpacity: 1,
                    weight: 2
                  }}
                  eventHandlers={eventHandlers}
                />
              </Circle>
            );
          })}

          {visibleShelters.map(shelter => (
            <CircleMarker
              key={shelter.id}
              center={[shelter.lat, shelter.lon]}
              radius={shelter.id === selectedShelterId ? 13 : 9}
              pathOptions={{
                color: '#fff',
                fillColor: '#366ab5',
                fillOpacity: 1,
                weight: 3
              }}
              eventHandlers={onSelectShelter
                ? { click: () => onSelectShelter(shelter.id) }
                : {}}
            >
              <Tooltip direction="top">
                <strong>{shelter.name}</strong>
                <br />
                Ponto fictício · {shelter.capacity} vagas no cenário
              </Tooltip>
            </CircleMarker>
          ))}

          {allowLocation && gps.position && (
            <CircleMarker
              center={[gps.position.lat, gps.position.lon]}
              radius={7}
              pathOptions={{
                color: '#fff',
                fillColor: '#275eae',
                fillOpacity: 1,
                weight: 3
              }}
            >
              <Tooltip>Sua localização</Tooltip>
            </CircleMarker>
          )}
        </MapContainer>

        <div className="map-caption">
          Zonas e estacas ilustrativas · limites sem validade geotécnica
        </div>
      </div>

      <div className="map-bottom">
        <div className="legend">
          <span><i className="green-dot" />Estável</span>
          <span><i className="amber-dot" />Atenção</span>
          <span><i className="red-dot" />Crítico / alerta</span>

          {showShelters && (
            <span>
              <i style={{ background: '#366ab5' }} />
              Abrigo fictício
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

          <span className="text-button">
            Destacar ponto no mapa
          </span>
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