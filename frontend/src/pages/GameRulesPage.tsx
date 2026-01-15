import React from 'react';
import { useTranslation } from 'react-i18next';

const GameRulesPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="game-rules-page">
      <h2>{t('gameRules')}</h2>
      
      <div className="rules-container">
        {/* Basic Rules Section */}
        <section className="rules-section">
          <h3>{t('basic_rules')}</h3>
          <div className="rules-content">
            <p>{t('rules_intro')}</p>
            <p>{t('rules_dice_range')}</p>
            <p>{t('rules_winning_condition')}</p>
          </div>
        </section>

        {/* Betting Options Section */}
        <section className="rules-section">
          <h3>{t('betting_options')}</h3>
          <div className="rules-content">
            <div className="betting-option">
              <h4>{t('small')}</h4>
              <p>{t('small_description')}</p>
              <p className="odds-info">{t('odds')}: <strong>1.99x</strong></p>
            </div>
            
            <div className="betting-option">
              <h4>{t('large')}</h4>
              <p>{t('large_description')}</p>
              <p className="odds-info">{t('odds')}: <strong>1.99x</strong></p>
            </div>
            
            <div className="betting-option">
              <h4>{t('exactNumber')}</h4>
              <p>{t('exact_number_description')}</p>
              <p className="odds-info">{t('odds')}: <strong>19.99x</strong></p>
            </div>
          </div>
        </section>

        {/* Multiplier Section */}
        <section className="rules-section">
          <h3>{t('multiplier')}</h3>
          <div className="rules-content">
            <p>{t('multiplier_description')}</p>
            <p>{t('multiplier_example')}</p>
            <div className="multiplier-table">
              <div className="table-header">
                <div>{t('multiplier_value')}</div>
                <div>{t('potential_win_example')}</div>
              </div>
              <div className="table-row">
                <div>1x</div>
                <div>1.99 $WEDS</div>
              </div>
              <div className="table-row">
                <div>2x</div>
                <div>3.98 $WEDS</div>
              </div>
              <div className="table-row">
                <div>5x</div>
                <div>9.95 $WEDS</div>
              </div>
              <div className="table-row">
                <div>10x</div>
                <div>19.90 $WEDS</div>
              </div>
              <div className="table-row">
                <div>100x</div>
                <div>199.00 $WEDS</div>
              </div>
            </div>
          </div>
        </section>

        {/* Limits Section */}
        <section className="rules-section">
          <h3>{t('limits')}</h3>
          <div className="rules-content">
            <div className="limit-item">
              <h4>{t('minimum_bet')}</h4>
              <p>0.1 $WEDS</p>
            </div>
            <div className="limit-item">
              <h4>{t('maximum_bet')}</h4>
              <p>100 $WEDS</p>
            </div>
            <div className="limit-item">
              <h4>{t('maximum_multiplier')}</h4>
              <p>100x</p>
            </div>
          </div>
        </section>

        {/* House Edge Section */}
        <section className="rules-section">
          <h3>{t('house_edge')}</h3>
          <div className="rules-content">
            <p>{t('house_edge_description')}</p>
            <p>{t('house_edge_value')}</p>
            <p>{t('fairness_guarantee')}</p>
          </div>
        </section>

        {/* Game Process Section */}
        <section className="rules-section">
          <h3>{t('game_process')}</h3>
          <div className="rules-content">
            <ol className="step-by-step">
              <li>{t('game_step_1')}</li>
              <li>{t('game_step_2')}</li>
              <li>{t('game_step_3')}</li>
              <li>{t('game_step_4')}</li>
              <li>{t('game_step_5')}</li>
            </ol>
          </div>
        </section>

        {/* Terms Section */}
        <section className="rules-section">
          <h3>{t('terms_conditions')}</h3>
          <div className="rules-content">
            <ul className="terms-list">
              <li>{t('term_1')}</li>
              <li>{t('term_2')}</li>
              <li>{t('term_3')}</li>
              <li>{t('term_4')}</li>
              <li>{t('term_5')}</li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
};

export default GameRulesPage;
