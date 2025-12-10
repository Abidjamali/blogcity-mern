// client/src/components/ShareButton.jsx

import React, { useState } from 'react';

const ShareButton = ({ post, size = 'medium' }) => {
    const [showShareMenu, setShowShareMenu] = useState(false);
    const [copied, setCopied] = useState(false);

    const postUrl = `${window.location.origin}/post/${post._id}`;
    const postTitle = post.title;
    const postExcerpt = post.content.substring(0, 100) + '...';

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(postUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = postUrl;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const shareOnTwitter = () => {
        const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(postTitle)}&url=${encodeURIComponent(postUrl)}`;
        window.open(twitterUrl, '_blank', 'width=600,height=400');
        setShowShareMenu(false);
    };

    const shareOnFacebook = () => {
        const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`;
        window.open(facebookUrl, '_blank', 'width=600,height=400');
        setShowShareMenu(false);
    };

    const shareOnWhatsApp = () => {
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(postTitle + ' ' + postUrl)}`;
        window.open(whatsappUrl, '_blank');
        setShowShareMenu(false);
    };

    const nativeShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: postTitle,
                    text: postExcerpt,
                    url: postUrl,
                });
                setShowShareMenu(false);
            } catch (error) {
                console.log('Error sharing:', error);
            }
        } else {
            // Fallback to copy if native share not supported
            copyToClipboard();
        }
    };

    const getButtonStyles = () => {
        const baseStyles = {
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: size === 'small' ? '6px' : '8px',
            borderRadius: '6px',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative'
        };

        if (size === 'small') {
            return {
                ...baseStyles,
                fontSize: '14px'
            };
        } else if (size === 'large') {
            return {
                ...baseStyles,
                fontSize: '18px',
                padding: '12px'
            };
        } else {
            return {
                ...baseStyles,
                fontSize: '16px'
            };
        }
    };

    const getMenuStyles = () => {
        return {
            position: 'absolute',
            top: '100%',
            right: 0,
            marginTop: '5px',
            backgroundColor: 'white',
            border: '1px solid #ddd',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            minWidth: '180px',
            zIndex: 1000,
            overflow: 'hidden'
        };
    };

    return (
        <div style={{ position: 'relative' }}>
            <button
                onClick={() => setShowShareMenu(!showShareMenu)}
                style={{
                    ...getButtonStyles(),
                    color: '#666',
                    backgroundColor: showShareMenu ? '#f0f0f0' : 'transparent'
                }}
                onMouseEnter={(e) => {
                    if (!showShareMenu) {
                        e.target.style.backgroundColor = '#f0f0f0';
                        e.target.style.color = '#007bff';
                    }
                }}
                onMouseLeave={(e) => {
                    if (!showShareMenu) {
                        e.target.style.backgroundColor = 'transparent';
                        e.target.style.color = '#666';
                    }
                }}
                title="Share this post"
            >
                {size === 'small' ? '🔗' : '📤'} {size !== 'small' && 'Share'}
            </button>

            {showShareMenu && (
                <>
                    {/* Backdrop */}
                    <div
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            zIndex: 999
                        }}
                        onClick={() => setShowShareMenu(false)}
                    />
                    
                    {/* Menu */}
                    <div style={getMenuStyles()}>
                        {navigator.share && (
                            <button
                                onClick={nativeShare}
                                style={shareMenuItemStyle}
                            >
                                📱 Share via...
                            </button>
                        )}
                        
                        <button
                            onClick={copyToClipboard}
                            style={shareMenuItemStyle}
                        >
                            {copied ? '✅ Copied!' : '📋 Copy Link'}
                        </button>
                        
                        <button
                            onClick={shareOnTwitter}
                            style={shareMenuItemStyle}
                        >
                            🐦 Twitter
                        </button>
                        
                        <button
                            onClick={shareOnFacebook}
                            style={shareMenuItemStyle}
                        >
                            📘 Facebook
                        </button>
                        
                        <button
                            onClick={shareOnWhatsApp}
                            style={shareMenuItemStyle}
                        >
                            💬 WhatsApp
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

const shareMenuItemStyle = {
    display: 'block',
    width: '100%',
    padding: '12px 16px',
    border: 'none',
    background: 'none',
    textAlign: 'left',
    cursor: 'pointer',
    fontSize: '14px',
    color: '#333',
    borderBottom: '1px solid #eee',
    transition: 'background-color 0.2s'
};

export default ShareButton;