import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';
// Asegúrate de importar tu servicio API si lo tienes:
// import { getGameById, addGame, updateGame } from '../api/gameService'; 

const FormContainer = styled.div`
  width: 90%;
  max-width: 800px;
  margin: 0 auto;
  padding: 30px;
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

const FormGrid = styled.form`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px 40px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 15px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
  color: #555;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1em;
  box-sizing: border-box;
`;

const Select = styled.select`
  width: 100%;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1em;
  box-sizing: border-box;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1em;
  min-height: 100px;
  resize: vertical;
  box-sizing: border-box;
`;

const CheckboxGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-top: 5px;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 5px;
  font-weight: normal;
  color: #666;
`;

const CheckboxInput = styled.input`
  margin-right: 5px;
`;

const StarRating = styled.div`
  display: flex;
  gap: 5px;
  margin-top: 5px;
`;

const Star = styled.span`
  cursor: pointer;
  font-size: 1.5em;
  color: ${props => (props.filled ? 'gold' : '#ccc')};
`;

const ButtonContainer = styled.div`
  grid-column: 1 / -1;
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 30px;
`;

const Button = styled.button`
  background-color: ${props => (props.primary ? '#007bff' : '#6c757d')};
  color: white;
  padding: 12px 25px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1.1em;
  transition: background-color 0.2s ease-in-out;

  &:hover {
    background-color: ${props => (props.primary ? '#0056b3' : '#5a6268')};
  }
`;

function FormularioJuego() {
  const { id } = useParams(); // Para obtener el ID del juego si estamos editando
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    platforms: [],
    genres: [],
    developer: '',
    publisher: '',
    releaseDate: '',
    coverUrl: '',
    synopsis: '',
    status: 'Pendiente',
    rating: 0,
    hoursPlayed: 0,
  });

  useEffect(() => {
    if (id) {
      // AQUÍ: Llama a tu función de API para obtener los detalles del juego
      // Ejemplo: getGameById(id).then(gameData => setFormData(gameData));
      // Por ahora, simulamos unos datos:
      const gameToEdit = {
        id: '1',
        title: 'The Witcher 3: Wild Hunt',
        platforms: ['PC', 'PS4'],
        genres: ['RPG', 'Aventura'],
        developer: 'CD Projekt Red',
        publisher: 'CD Projekt',
        releaseDate: '2015-05-19',
        coverUrl: 'https://via.placeholder.com/180x240/1a1a1a/ffffff?text=Witcher3',
        synopsis: 'Un RPG de mundo abierto con una historia profunda y personajes memorables.',
        status: 'Completado',
        rating: 5,
        hoursPlayed: 200,
      };
      setFormData(gameToEdit);
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: checked
          ? [...prev[name], value]
          : prev[name].filter(item => item !== value),
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleStarClick = (index) => {
    setFormData(prev => ({
      ...prev,
      rating: index + 1,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        // AQUÍ: Llama a tu función de API para actualizar el juego
        // await updateGame(id, formData);
        console.log('Actualizando juego:', formData);
        alert('Juego actualizado (simulado)!');
      } else {
        // AQUÍ: Llama a tu función de API para agregar el juego
        // await addGame(formData);
        console.log('Agregando nuevo juego:', formData);
        alert('Juego agregado (simulado)!');
      }
      navigate('/'); // Redirige a la biblioteca después de guardar
    } catch (error) {
      console.error("Error al guardar el juego:", error);
      alert("Hubo un error al guardar el juego.");
    }
  };

  const availablePlatforms = ['PC', 'PS5', 'Xbox Series X', 'Switch', 'PS4', 'Xbox One'];
  const availableGenres = ['RPG', 'Aventura', 'Acción', 'Estrategia', 'Indie', 'Simulación', 'Deportes', 'Roguelike', 'Terror', 'Lucha'];

  return (
    <FormContainer>
      <Title>{id ? `Editar Juego: ${formData.title}` : 'Agregar Nuevo Juego'}</Title>
      <FormGrid onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="title">Título</Label>
          <Input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label>Plataforma(s)</Label>
          <CheckboxGroup>
            {availablePlatforms.map(platform => (
              <CheckboxLabel key={platform}>
                <CheckboxInput
                  type="checkbox"
                  name="platforms"
                  value={platform}
                  checked={formData.platforms.includes(platform)}
                  onChange={handleChange}
                />
                {platform}
              </CheckboxLabel>
            ))}
          </CheckboxGroup>
        </FormGroup>

        <FormGroup>
          <Label>Género(s)</Label>
          <CheckboxGroup>
            {availableGenres.map(genre => (
              <CheckboxLabel key={genre}>
                <CheckboxInput
                  type="checkbox"
                  name="genres"
                  value={genre}
                  checked={formData.genres.includes(genre)}
                  onChange={handleChange}
                />
                {genre}
              </CheckboxLabel>
            ))}
          </CheckboxGroup>
        </FormGroup>

        <FormGroup>
          <Label htmlFor="developer">Desarrollador</Label>
          <Input
            type="text"
            id="developer"
            name="developer"
            value={formData.developer}
            onChange={handleChange}
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="publisher">Editor</Label>
          <Input
            type="text"
            id="publisher"
            name="publisher"
            value={formData.publisher}
            onChange={handleChange}
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="releaseDate">Fecha de Lanzamiento</Label>
          <Input
            type="date"
            id="releaseDate"
            name="releaseDate"
            value={formData.releaseDate}
            onChange={handleChange}
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="coverUrl">URL de la Portada</Label>
          <Input
            type="url"
            id="coverUrl"
            name="coverUrl"
            value={formData.coverUrl}
            onChange={handleChange}
            placeholder="Ej: https://example.com/cover.jpg"
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="synopsis">Sinopsis</Label>
          <TextArea
            id="synopsis"
            name="synopsis"
            value={formData.synopsis}
            onChange={handleChange}
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="status">Estado</Label>
          <Select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="Pendiente">Pendiente</option>
            <option value="Jugando">Jugando</option>
            <option value="Completado">Completado</option>
            <option value="Abandonado">Abandonado</option>
          </Select>
        </FormGroup>

        <FormGroup>
          <Label htmlFor="rating">Calificación</Label>
          <StarRating>
            {[...Array(5)].map((_, index) => (
              <Star
                key={index}
                filled={index < formData.rating}
                onClick={() => handleStarClick(index)}
              >
                &#9733;
              </Star>
            ))}
          </StarRating>
        </FormGroup>

        <FormGroup>
          <Label htmlFor="hoursPlayed">Horas Jugadas</Label>
          <Input
            type="number"
            id="hoursPlayed"
            name="hoursPlayed"
            value={formData.hoursPlayed}
            onChange={handleChange}
            min="0"
          />
        </FormGroup>

        <ButtonContainer>
          <Button type="submit" primary>
            {id ? 'Guardar Cambios' : 'Agregar Juego'}
          </Button>
          <Button type="button" onClick={() => navigate(-1)}> {/* navigate(-1) vuelve a la página anterior */}
            Cancelar
          </Button>
        </ButtonContainer>
      </FormGrid>
    </FormContainer>
  );
}

export default FormularioJuego;