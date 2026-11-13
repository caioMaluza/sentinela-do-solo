import { useEffect, useState } from 'react';

import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Tooltip,
  useMap
} from 'react-leaflet';

import { MapPin, Expand, House, Info } from 'lucide-react';

import 'leaflet/dist/leaflet.css';

import { Badge, SectionTitle } from './UI';
import './CitizenMap.css';

function NeighborhoodView({
  cluster,
  shelters,
  selectedShelterId,
  revision
}) {
  const map = useMap();

  const pointsKey = shelters
    .map(shelter => shelter.id)
    .join(',');

  useEffect(() => {
    map.invalidateSize();

    const selected = shelters.find(
      shelter => shelter.id === selectedShelterId
    );

    const points = [
      [cluster.lat, cluster.lon],
      ...(selected ? [selected] : shelters).map(
        shelter => [shelter.lat, shelter.lon]
      )
    ];

    if (points.length > 1) {
      map.fitBounds(points, {
        padding: [45, 45],
        maxZoom: 15,
        animate: false
      });
    } else {
      map.setView(
        [cluster.lat, cluster.lon],
        14,
        { animate: false }
      );
    }
  }, [
    map,
    cluster.id,
    pointsKey,
    selectedShelterId
  ]);

  useEffect(() => {
    if (!revision) return;

    const points = [
      [cluster.lat, cluster.lon],
      ...shelters.map(shelter => [
        shelter.lat,
        shelter.lon
      ])
    ];

    if (points.length > 1) {
      map.fitBounds(points, {
        padding: [45, 45],
        maxZoom: 15,
        animate: false
      });
    } else {
      map.setView(
        [cluster.lat, cluster.lon],
        14,
        { animate: false }
      );
    }
  }, [map, revision]);

  return null;
}

export function CitizenMap({
  cluster,
  state,
  showShelters = false,
  shelters = [],
  selectedShelterId,
  onSelectShelter,
  expanded = false
}) {
  const [revision, setRevision] = useState(0);

  const visibleShelters = showShelters
    ? shelters
    : [];

  const red = ['critical', 'evacuation'].includes(state);

  const statusText = red
    ? 'Alerta de teste'
    : state === 'returned'
      ? 'Retorno no exercício'
      : state === 'unknown'
        ? 'Informação indisponível'
        : 'Acompanhe os avisos';

  return (
    <section className="card map-card citizen-map">
      <SectionTitle title={`Seu bairro: ${cluster.name}`}>
        <Badge tone={red ? 'red' : 'neutral'}>
          {statusText}
        </Badge>
      </SectionTitle>

      <p className="citizen-map-intro">
        {showShelters
          ? 'Os pontos azuis são exemplos de abrigos. Escolha um na lista para vê-lo em destaque.'
          : 'Localize o bairro que você selecionou. Os abrigos de exemplo aparecem quando você testa o alerta vermelho.'}
      </p>

      <div className={`map-wrap${expanded ? ' expanded' : ''}`}>
        <MapContainer
          center={[cluster.lat, cluster.lon]}
          zoom={14}
          minZoom={12}
          maxZoom={18}
          maxBounds={[
            [-23.60, -46.87],
            [-23.32, -46.55]
          ]}
          maxBoundsViscosity={1}
          scrollWheelZoom={false}
        >
          <NeighborhoodView
            cluster={cluster}
            shelters={visibleShelters}
            selectedShelterId={selectedShelterId}
            revision={revision}
          />

          <TileLayer
            attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <CircleMarker
            center={[cluster.lat, cluster.lon]}
            radius={10}
            pathOptions={{
              color: '#fff',
              weight: 3,
              fillColor: red ? '#b74936' : '#245d46',
              fillOpacity: 1
            }}
          >
            <Tooltip permanent direction="top">
              <strong>{cluster.name}</strong>
              <br />
              Bairro selecionado
            </Tooltip>
          </CircleMarker>

          {visibleShelters.map((shelter, index) => (
            <CircleMarker
              key={shelter.id}
              center={[shelter.lat, shelter.lon]}
              radius={selectedShelterId === shelter.id ? 13 : 9}
              pathOptions={{
                color: '#fff',
                weight: 3,
                fillColor: '#32699a',
                fillOpacity: 1
              }}
              eventHandlers={{
                click: () => onSelectShelter?.(shelter.id)
              }}
            >
              <Tooltip
                permanent={selectedShelterId === shelter.id}
                direction="top"
              >
                {selectedShelterId === shelter.id
                  ? shelter.name
                  : `Abrigo de exemplo ${index + 1}`}
              </Tooltip>
            </CircleMarker>
          ))}
        </MapContainer>

        <div className="map-caption">
          São Paulo · Pontos de demonstração
        </div>
      </div>

      <div className="citizen-map-key">
        <span>
          <MapPin size={16} />
          Bairro selecionado
        </span>

        {showShelters && (
          <span>
            <House size={16} />
            Abrigos fictícios
          </span>
        )}

        <button
          type="button"
          className="text-button"
          onClick={() => setRevision(previous => previous + 1)}
        >
          <Expand size={15} />
          Ver bairro
        </button>
      </div>

      <div className="citizen-map-note">
        <Info size={16} />

        <p>
          {showShelters
            ? 'Os abrigos são inventados para este teste. Não use esses pontos para se deslocar em uma emergência. Siga as orientações oficiais da Defesa Civil.'
            : 'Este mapa é uma demonstração. Em uma situação real, acompanhe os avisos da Defesa Civil.'}
        </p>
      </div>
    </section>
  );
}