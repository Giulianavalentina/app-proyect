import { act, renderHook, waitFor } from '@testing-library/react';
import { useAlarms } from '../src/hooks/useAlarms';

const expectedTestAlarms = [
  { id: '1', medication: 'Paracetamol', dosage: 500, time: '08:00', isActive: true, days: ['LUN', 'MAR', 'MIE', 'JUE', 'VIE'] },
  { id: '2', medication: 'Ibuprofeno', dosage: 400, time: '20:00', isActive: true, days: ['LUN', 'MIE', 'VIE'] }
];


describe('useAlarms', () => {
  beforeAll(() => {
    jest.useFakeTimers();
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterAll(() => {
    jest.useRealTimers();
    (console.log as jest.Mock).mockRestore();
  });

  test('debe inicializarse con alarms como array vacío y loading en true', () => {
    const { result } = renderHook(() => useAlarms());
    
    const { alarms, loading } = result.current; 

    expect(alarms).toEqual([]);
    expect(loading).toBe(true);
  });
  
  test('debe poner loading en false y alarms a un array vacío después del timeout', async () => {
    const { result } = renderHook(() => useAlarms());

    act(() => {
      jest.runAllTimers(); 
    });

    await waitFor(() => {
        const { alarms, loading } = result.current; 
        
        expect(loading).toBe(false); 
        expect(alarms).toEqual([]); 
    });
  });

  test('deleteAlarm debe llamar a console.log con el ID correcto', () => {
    const { result } = renderHook(() => useAlarms());
    
    const alarmIdToDelete = '1';

    act(() => {
      result.current.deleteAlarm(alarmIdToDelete);
    });

    expect(console.log).toHaveBeenCalledWith('Eliminar alarma:', alarmIdToDelete);
  });
});