import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const StatsContainer = styled.div`
  width: 90%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  text-align: center;
  color: #333;
  margin-bottom: 30px;
  font-size: 2.2em;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  margin-top: 30px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const StatCard = styled.div`
  background-color: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const StatCardTitle = styled.h3`
  color: #555;
  margin-bottom: 15px;
  font-size: 1.3em;
`;

const HighlightNumber = styled.p`
  font-size: 3em;
  font-weight: bold;
  color: #007bff;
  margin: 0;
`;

const SmallText = styled.p`
  font-size: 0.9em;
  color: #777;
  margin: 5px 0 0;
`;

const GameThumbnail = styled.img`
  width: 80px;
  height: 100px;
  object-fit: cover;
  border-radius: 5px;
  margin-bottom: 10px;
`;

const RecentActivityList = styled.ul`
  list-style: none;
  padding: 0;
  width: 100%;
`;

const RecentActivityItem = styled.li`
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
  &:last-child {
    border-bottom: none;
  }
`;

const RecentActivityText = styled.div`
  text-align: left;
`;

const RecentGameTitle = styled.p`
  margin: 0;
  font-weight: bold;
  color: #333;
`;

const RecentGameDate = styled.p`
  margin: 0;
  font-size: 0.8em;
  color: #777;
`;


function EstadisticasPersonales() {
  // Simulación de datos de estadísticas
  const [statsData, setStatsData] = useState({
    totalGames: 125,
    totalHoursPlayed: 1250,
    genres: {
      'RPG': 45,
      'Aventura': 30,
      'Acción': 20,
      'Indie': 15,
      'Simulación': 15,
    },
    platforms: {
      'PC': 55,
      'PS5': 30,
      'Switch': 25,
      'Xbox Series X': 15,
    },
    status: {
      'Completado': 55,
      'Jugando': 12,
      'Pendiente': 30,
      'Abandonado': 8,
    },
    mostPlayedGame: {
      title: 'The Witcher 3',
      hours: 200,
      cover: 'https://via.placeholder.com/180x240/1a1a1a/ffffff?text=Witcher3',
    },
    recentActivity: [
      { id: 1, title: 'Elden Ring', date: '2023-10-26', cover: 'https://via.placeholder.com/180x240/1a1a1a/ffffff?text=EldenRing' },
      { id: 2, title: 'Minecraft', date: '2023-10-20', cover: 'https://via.placeholder.com/180x240/1a1a1a/ffffff?text=Minecraft' },
      { id: 3, title: 'Hades', date: '2023-10-15', cover: 'https://via.placeholder.com/180x240/1a1a1a/ffffff?text=Hades' },
    ],
  });

  // Datos para el gráfico de géneros
  const genreChartData = {
    labels: Object.keys(statsData.genres),
    datasets: [
      {
        data: Object.values(statsData.genres),
        backgroundColor: [
          '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'
        ],
        hoverBackgroundColor: [
          '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'
        ],
      },
    ],
  };

  // Datos para el gráfico de plataformas
  const platformChartData = {
    labels: Object.keys(statsData.platforms),
    datasets: [
      {
        label: 'Juegos por Plataforma',
        data: Object.values(statsData.platforms),
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <StatsContainer>
      <Title>Tus Estadísticas de Gaming</Title>

      <StatsGrid>
        <StatCard>
          <StatCardTitle>Total de Juegos</StatCardTitle>
          <HighlightNumber>{statsData.totalGames}</HighlightNumber>
          <SmallText>Juegos en tu biblioteca</SmallText>
        </StatCard>

        <StatCard>
          <StatCardTitle>Horas Jugadas</StatCardTitle>
          <HighlightNumber>{statsData.totalHoursPlayed}+</HighlightNumber>
          <SmallText>Horas registradas</SmallText>
        </StatCard>

        <StatCard>
          <StatCardTitle>Juego Más Jugado</StatCardTitle>
          {statsData.mostPlayedGame && (
            <>
              <GameThumbnail src={statsData.mostPlayedGame.cover} alt={statsData.mostPlayedGame.title} />
              <p><strong>{statsData.mostPlayedGame.title}</strong></p>
              <SmallText>{statsData.mostPlayedGame.hours} horas</SmallText>
            </>
          )}
        </StatCard>

        <StatCard>
          <StatCardTitle>Progreso de Juegos</StatCardTitle>
          <div style={{ width: '100%', maxWidth: '200px', margin: '0 auto' }}>
             <Pie
              data={{
                labels: Object.keys(statsData.status),
                datasets: [{
                  data: Object.values(statsData.status),
                  backgroundColor: ['#28a745', '#007bff', '#ffc107', '#dc3545'],
                }]
              }}
              options={{ responsive: true, maintainAspectRatio: false }}
             />
          </div>
          <SmallText>Completados: {statsData.status.Completado} | Jugando: {statsData.status.Jugando}</SmallText>
        </StatCard>

        <StatCard>
          <StatCardTitle>Géneros Favoritos</StatCardTitle>
          <div style={{ width: '100%', maxWidth: '300px', margin: '0 auto' }}>
            <Pie data={genreChartData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </StatCard>

        <StatCard>
          <StatCardTitle>Plataformas</StatCardTitle>
          <div style={{ width: '100%', maxWidth: '300px', margin: '0 auto' }}>
            <Bar data={platformChartData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </StatCard>

        <StatCard style={{ gridColumn: '1 / -1' }}>
          <StatCardTitle>Actividad Reciente</StatCardTitle>
          <RecentActivityList>
            {statsData.recentActivity.map(activity => (
              <RecentActivityItem key={activity.id}>
                <GameThumbnail src={activity.cover} alt={activity.title} />
                <RecentActivityText>
                  <RecentGameTitle>{activity.title}</RecentGameTitle>
                  <RecentGameDate>Añadido el {activity.date}</RecentGameDate>
                </RecentActivityText>
              </RecentActivityItem>
            ))}
          </RecentActivityList>
        </StatCard>
      </StatsGrid>
    </StatsContainer>
  );
}

export default EstadisticasPersonales;