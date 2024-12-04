from scipy.signal import butter, filtfilt

def low_pass_filter(data, cutoff=0.1, fs=30):
    """
    Apply a low-pass Butterworth filter to the data.
    """
    b, a = butter(2, cutoff / (fs / 2), btype='low')
    return filtfilt(b, a, data)
