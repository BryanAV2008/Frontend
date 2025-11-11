import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const Card = styled.div`
  background-color: #333;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  width: 180px;
  cursor: pointer;
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  color: white;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.4);
  }
`;

const CoverImage = styled.img`
  width: 100%;
  height: 240px;
  object-fit: cover;
`;

const GameInfo = styled.div`
  padding: 10px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
`;

const Title = styled.h3`
  font-size: 1.1em;
  margin: 5px 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Status = styled.p`
  font-size: 0.9em;
  color: #ccc;
  margin: 0;
`;

const Rating = styled.div`
  color: gold;
  font-size: 1em;
  margin-top: 5px;
`;

const Stars = ({ count }) => {
  return <div>{'⭐'.repeat(count)}{'☆'.repeat(5 - count)}</div>;
};

function CardJuego({ game }) {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/juego/${game.id}`); // Navega a tu GameDetail page
  };

  return (
    <Card onClick={handleCardClick}>
      <CoverImage src={game.cover} alt={game.title} />
      <GameInfo>
        <Title>{game.title}</Title>
        <Status>{game.status}</Status>
        <Rating>
          <Stars count={game.rating} />
        </Rating>
      </GameInfo>
    </Card>
  );
}

export default CardJuego;