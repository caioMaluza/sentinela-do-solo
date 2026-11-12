import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Tooltip
} from 'react-leaflet';

import 'leaflet/dist/leaflet.css';

import { clusters } from '../data/clusters';
import { risk } from '../lib/risk';
import { SectionTitle, Badge } from './UI';
import { useLocation } from '../hooks/useLocation';

import { LocateFixed } from 'lucide-react';

function CenterOnGps({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position) map.flyTo([position.lat, position.lon], 14);
  }, [position, map]);
  return null;
}

export function RegionMap({ cluster, expanded = false }) {
  const gps = useLocation();

  return (
    <section className="card map-card">
      <SectionTitle title="Um olhar sobre a sua região">
        <Badge tone="neutral">
          3 áreas demonstrativas
        </Badge>
      </SectionTitle>

      <div className={'map-wrap ' + (expanded ? 'expanded' : '')}>
        <MapContainer
          key={cluster.id}
          center={[cluster.lat, cluster.lon]}
          zoom={13}
          scrollWheelZoom={false}
        >
          <CenterOnGps position={gps.position} />
          <TileLayer
            attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {clusters.map(c => (
            <CircleMarker
              key={c.id}
              center={[c.lat, c.lon]}
              radius={22}
              pathOptions={{
                color:
                  risk(c.rate) === 'stable'
                    ? '#40816c'
                    : risk(c.rate) === 'critical'
                      ? '#b65e4e'
                      : '#c69a42',
                fillOpacity: 0.28
              }}
            >
              <Tooltip permanent>
                {c.name}
              </Tooltip>
            </CircleMarker>
          ))}

          {gps.position && (
            <CircleMarker
              center={[gps.position.lat, gps.position.lon]}
              radius={8}
            >
              <Tooltip>
                Sua localização
              </Tooltip>
            </CircleMarker>
          )}
        </MapContainer>

        <div className="map-caption">
          <span className="dot" />
          Microzonas ilustrativas · não são limites geotécnicos reais
        </div>
      </div>

      <div className="map-bottom">
        <div className="legend">
          <span>
            <i className="green-dot" />
            Estável
          </span>

          <span>
            <i className="amber-dot" />
            Atenção
          </span>

          <span>
            <i className="red-dot" />
            Análise prioritária
          </span>
        </div>

        <button
          className="text-button"
          onClick={gps.locate}
          disabled={gps.loading}
        >
          <LocateFixed size={16} />

          {gps.loading
            ? 'Localizando…'
            : 'Minha localização'}
        </button>
      </div>

      {gps.error && (
        <p className="error px-5 pb-4">
          {gps.error}
        </p>
      )}
    </section>
  );
}

export function ShelterRoute({ cluster }) {
  return (
    <section className="card p-6">
      <h2>Exercício de evacuação · {cluster.name}</h2>
      <p className="muted my-3">
        Não há abrigos ou rotas oficiais cadastrados neste protótipo.
        Por segurança, o sistema não gera caminhos até coordenadas fictícias.
      </p>
      <p className="muted">
        Em uma emergência real, siga exclusivamente as orientações das autoridades.
        Defesa Civil: 199 · Bombeiros: 193.
      </p>
    </section>
  );
}
