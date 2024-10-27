function App(): JSX.Element {
  return (
    <div
      style={{
        width: 162,
        height: 183.3,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
        gap: 5,
        display: 'inline-flex'
      }}
    >
      <div
        style={{
          width: 162,
          height: 162,
          position: 'relative',
          background:
            'linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.80) 100%), linear-gradient(0deg, rgba(0, 0, 0, 0.50) 0%, rgba(0, 0, 0, 0.50) 100%)',
          borderRadius: 12,
          overflow: 'hidden'
        }}
      >
        <img
          style={{
            width: 94.06,
            height: 94.06,
            left: 17.89,
            top: 26.22,
            position: 'absolute',
            borderRadius: 100
          }}
          src="https://c.saavncdn.com/203/This-Is-Acting-English-2016-500x500.jpg"
        />
        <img
          style={{
            width: 61.01,
            height: 61.01,
            left: 81,
            top: 65.46,
            position: 'absolute',
            borderRadius: 100
          }}
          src="https://c.saavncdn.com/203/This-Is-Acting-English-2016-500x500.jpg"
        />
        <img
          style={{
            width: 40.5,
            height: 40.5,
            left: 68.1,
            top: 107.67,
            position: 'absolute',
            borderRadius: 100
          }}
          src="https://c.saavncdn.com/203/This-Is-Acting-English-2016-500x500.jpg"
        />
        <img
          style={{
            width: 27.14,
            height: 27.14,
            left: 43.07,
            top: 114.36,
            position: 'absolute',
            borderRadius: 100
          }}
          src="https://via.placeholder.com/27x27"
        />
        <div
          style={{
            left: 13.21,
            top: 8.62,
            position: 'absolute',
            color: '#FEF7FF',
            fontSize: 11.43,
            fontFamily: 'Roboto',
            fontWeight: '500',
            lineHeight: 13.98,
            letterSpacing: 0.07,
            wordWrap: 'break-word'
          }}
        >
          Room Title
        </div>
      </div>
      <div
        style={{
          alignSelf: 'stretch',
          justifyContent: 'space-between',
          alignItems: 'center',
          display: 'inline-flex'
        }}
      >
        <div
          style={{ justifyContent: 'flex-start', alignItems: 'center', gap: 4.57, display: 'flex' }}
        >
          <div
            style={{
              height: 16.3,
              borderRadius: 4.66,
              overflow: 'hidden',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 3.26,
              display: 'inline-flex'
            }}
          >
            <div
              style={{
                alignSelf: 'stretch',
                flex: '1 1 0',
                paddingTop: 4.08,
                paddingBottom: 4.08,
                paddingLeft: 6.52,
                paddingRight: 9.78,
                justifyContent: 'center',
                alignItems: 'center',
                gap: 3.26,
                display: 'inline-flex'
              }}
            >
              <div style={{ width: 7.34, height: 7.34, position: 'relative' }}>
                <div
                  style={{
                    width: 5.5,
                    height: 6.11,
                    left: 0.92,
                    top: 0.61,
                    position: 'absolute',
                    background: 'white'
                  }}
                ></div>
              </div>
              <div
                style={{
                  textAlign: 'center',
                  color: 'white',
                  fontSize: 5.71,
                  fontFamily: 'Roboto',
                  fontWeight: '500',
                  lineHeight: 8.15,
                  letterSpacing: 0.04,
                  wordWrap: 'break-word'
                }}
              >
                Invite Friends
              </div>
            </div>
          </div>
        </div>
        <div
          style={{ justifyContent: 'flex-start', alignItems: 'center', gap: 4.57, display: 'flex' }}
        >
          <div
            style={{
              height: 16.3,
              background: 'white',
              borderRadius: 4.66,
              overflow: 'hidden',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 3.26,
              display: 'inline-flex'
            }}
          >
            <div
              style={{
                alignSelf: 'stretch',
                paddingLeft: 8,
                paddingRight: 8,
                paddingTop: 4,
                paddingBottom: 4,
                justifyContent: 'center',
                alignItems: 'center',
                gap: 3.26,
                display: 'inline-flex'
              }}
            >
              <div
                style={{
                  textAlign: 'center',
                  color: '#1D1B20',
                  fontSize: 5.71,
                  fontFamily: 'Roboto',
                  fontWeight: '500',
                  lineHeight: 8.15,
                  letterSpacing: 0.04,
                  wordWrap: 'break-word'
                }}
              >
                Join Room
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
