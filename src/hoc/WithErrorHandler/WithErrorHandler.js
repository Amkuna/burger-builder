import React from 'react';
import Modal from '../../components/UI/Modal/Modal';
import useHttpErrorHandler from '../../hooks/httpErrorHandler';

const withErrorHandler = (WrappedComponent, axios) => {
    return props => {        
        const [error, clearError] = useHttpErrorHandler(axios);

        return (
            <>
                <Modal show={error} modalClosed={clearError}>
                    {error && error}
                </Modal>
                <WrappedComponent {...props} />
            </>
        )
    }
}

export default withErrorHandler;