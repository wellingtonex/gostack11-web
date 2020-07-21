import React, { useState, useCallback, useEffect, useMemo } from 'react';
import ptBr, { isToday, format, parseISO, isAfter } from 'date-fns';

import DayPicker, { DayModifiers } from 'react-day-picker';
import 'react-day-picker/lib/style.css';
import { FiPower, FiClock } from 'react-icons/fi';

import { Link } from 'react-router-dom';
import {
  Container,
  Header,
  HeaderContent,
  Profile,
  Content,
  Schedule,
  NextAppointments,
  Section,
  Appointment,
  Calendar,
} from './styles';
import logoImg from '../../assets/logo.svg';
import { useAuth } from '../../hooks/AuthContext';
import api from '../../services/api';

interface MonthAvailability {
  day: number;
  available: boolean;
}

interface Appointment {
  id: string;
  date: string;
  hourFormatted: string;
  user: {
    id: string;
    name: string;
    avatar_url: string;
  };
}

const Dashboard: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [monthAvailability, setMonthAvailability] = useState<
    MonthAvailability[]
  >([]);
  const [appointmensts, setAppointmensts] = useState<Appointment[]>([]);
  const { signOut, user } = useAuth();

  useEffect(() => {
    api
      .get(`/providers/${user.id}/month-availability`, {
        params: {
          year: currentMonth.getFullYear(),
          month: currentMonth.getMonth() + 1,
        },
      })
      .then(response => {
        setMonthAvailability(response.data);
      });
  }, [currentMonth, user.id]);

  useEffect(() => {
    api
      .get<Appointment[]>('/appointments/me', {
        params: {
          year: selectedDate.getFullYear(),
          month: selectedDate.getMonth() + 1,
          day: selectedDate.getDate(),
        },
      })
      .then(response => {
        const appointmenstsFormatted = response.data.map(a => ({
          ...a,
          hourFormatted: format(parseISO(a.date), 'HH:mm'),
        }));
        setAppointmensts(appointmenstsFormatted);
      });
  }, [selectedDate]);

  const disbledDays = useMemo(() => {
    const dates = monthAvailability
      .filter(monthDay => !monthDay.available)
      .map(
        monthDay =>
          new Date(
            currentMonth.getFullYear(),
            currentMonth.getMonth(),
            monthDay.day,
          ),
      );
    return dates;
  }, [currentMonth, monthAvailability]);

  const selectedDateAsText = useMemo(
    () => format(selectedDate, "'Dia' dd 'de' MMMM", { locale: ptBr }),
    [selectedDate],
  );

  const selectedWeekDayAsText = useMemo(
    () => format(selectedDate, 'cccc', { locale: ptBr }),
    [selectedDate],
  );

  const morningAppointments = useMemo(
    () => appointmensts.filter(a => parseISO(a.date).getHours() <= 12),
    [appointmensts],
  );

  const afternoonAppointments = useMemo(
    () => appointmensts.filter(a => parseISO(a.date).getHours() > 12),
    [appointmensts],
  );

  const nextAppointment = useMemo(
    () => appointmensts.find(a => isAfter(parseISO(a.date), new Date())),
    [appointmensts],
  );

  const handleMonthChange = useCallback((month: Date) => {
    setCurrentMonth(month);
  }, []);

  const handleDateChange = useCallback((day: Date, modifiers: DayModifiers) => {
    if (modifiers.available && !modifiers.disabled) {
      setSelectedDate(day);
    }
  }, []);

  return (
    <Container>
      <Header>
        <HeaderContent>
          <img src={logoImg} alt="GoBarber" />
          <Profile>
            <img src={user.avatar_url} alt={user.name} />
            <div>
              <span>Bem vindo,</span>
              <Link to="/profile">
                <strong>{user.name}</strong>
              </Link>
            </div>
          </Profile>
          <button type="button" onClick={signOut}>
            <FiPower />
          </button>
        </HeaderContent>
      </Header>

      <Content>
        <Schedule>
          <h1>Horários agendados</h1>
          <p>
            {isToday(selectedDate) && <span>Hoje</span>}
            <span>{selectedDateAsText}</span>
            <span>{selectedWeekDayAsText}</span>
          </p>

          {isToday(selectedDate) && nextAppointment && (
            <NextAppointments>
              <strong>Atendimento a seguir</strong>
              <div>
                <img
                  src={nextAppointment.user.avatar_url}
                  alt={nextAppointment.user.name}
                />
                <strong>{nextAppointment.user.name}</strong>
                <span>
                  <FiClock />
                  {nextAppointment.hourFormatted}
                </span>
              </div>
            </NextAppointments>
          )}

          <Section>
            <strong>Manhã</strong>

            {morningAppointments.length === 0 && (
              <p>Nenhum agendamento neste periodo</p>
            )}

            {morningAppointments.map(a => (
              <Appointment key={a.id}>
                <span>
                  <FiClock />
                  {a.hourFormatted}
                </span>
                <div>
                  <img src={a.user.avatar_url} alt={a.user.name} />
                  <strong>{a.user.name}</strong>
                </div>
              </Appointment>
            ))}
          </Section>
          <Section>
            <strong>Tarde</strong>

            {afternoonAppointments.length === 0 && (
              <p>Nenhum agendamento neste periodo</p>
            )}

            {afternoonAppointments.map(a => (
              <Appointment key={a.id}>
                <span>
                  <FiClock />
                  {a.hourFormatted}
                </span>
                <div>
                  <img src={a.user.avatar_url} alt={a.user.name} />
                  <strong>{a.user.name}</strong>
                </div>
              </Appointment>
            ))}
          </Section>
        </Schedule>
        <Calendar>
          <DayPicker
            weekdaysShort={['D', 'S', 'T', 'Q', 'Q', 'S', 'S']}
            fromMonth={new Date()}
            disabledDays={[{ daysOfWeek: [0, 6] }, ...disbledDays]}
            modifiers={{
              available: { daysOfWeek: [1, 2, 3, 4, 5] },
            }}
            onMonthChange={handleMonthChange}
            selectedDays={selectedDate}
            onDayClick={handleDateChange}
            months={[
              'Janeiro',
              'Fevereiro',
              'Março',
              'Abril',
              'Maio',
              'Junho',
              'Julho',
              'Agosto',
              'Setembro',
              'Outubro',
              'Novembro',
              'Desembro',
            ]}
          />
        </Calendar>
      </Content>
    </Container>
  );
};

export default Dashboard;
